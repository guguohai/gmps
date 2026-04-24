# core_api 工单状态机开发方案

## 目标

`core_api` 是工单状态机的事实源。所有工单主状态变更都必须在 `core_api` 内完成，并统一经过状态机服务执行，保证状态、日志、进度、权限和可用动作一致。

支付、通知、SAP、物流、文件和定时任务可以独立为微服务，但它们不能直接修改工单状态。微服务只能通过 `core_api` 暴露的动作接口或内部事件接口触发状态机。

## 当前基础

当前项目已经具备状态机和工单核心表：

- `workflow.WfStatus`
- `workflow.WfAction`
- `workflow.WfTransition`
- `workflow.WfActionPermission`
- `workflow.WfAutoRule`
- `tickets.Ticket`
- `tickets.TicketStatusLog`
- `tickets.TicketActionLog`
- `tickets.TicketProgress`
- `tickets.TicketAvailableAction`

当前已有服务：

- `workflow.services.available_action_service.AvailableActionService`
- `tickets.services.ticket_progress_service.TicketProgressService`
- `tickets.services.ticket_no_service.TicketNoService`
- `tickets.services.operator_service.OperatorService`

下一步应补齐通用状态机执行服务，而不是在每个接口里手写状态判断。

工单状态、动作和流转的完整规格见 `docs/architecture/ticket_workflow_spec.md`。`core_api` 开发时应优先按该规格补齐主流程闭环，再逐步接入支付、退款、物流和自动任务的边界场景。

小程序查询工单详情接口的实现说明见 `docs/architecture/miniapp_ticket_detail_api_implementation.md`。该接口用于小程序收到统一通知后，按工单编号拉取最新聚合详情。

## 模块划分

### workflow app

负责状态机配置和状态机执行。

建议新增文件：

```text
apps/core_api/workflow/
  urls.py
  serializers.py
  services/
    workflow_engine_service.py
    workflow_permission_service.py
    workflow_condition_service.py
    workflow_side_effect_service.py
```

职责说明：

- `workflow_engine_service.py`：状态机执行主入口。
- `workflow_permission_service.py`：动作权限校验。
- `workflow_condition_service.py`：流转条件计算。
- `workflow_side_effect_service.py`：状态变更后的副作用调度，例如调用支付服务、通知服务、SAP 服务。

### tickets app

负责工单业务接口和工单领域数据。

建议新增文件：

```text
apps/core_api/tickets/
  urls.py
  serializers.py
  services/
    ticket_query_service.py
    ticket_action_service.py
    ticket_payment_summary_service.py
    ticket_event_idempotency_service.py
```

职责说明：

- `ticket_query_service.py`：列表、详情、状态筛选。
- `ticket_action_service.py`：工单动作入参校验和业务上下文组装。
- `ticket_payment_summary_service.py`：维护工单侧支付摘要。
- `ticket_event_idempotency_service.py`：内部事件幂等。

## 核心服务设计

### WorkflowEngineService

主入口：

```python
WorkflowEngineService.execute_action(
    *,
    biz_type: str,
    biz_id: int,
    action_code: str,
    operator=None,
    operator_role_code: str | None = None,
    trigger_type: str = "MANUAL",
    trigger_source: str | None = None,
    payload: dict | None = None,
    idempotency_key: str | None = None,
)
```

执行步骤：

1. 根据 `biz_type` 和 `biz_id` 加锁读取业务对象。工单场景使用 `Ticket.objects.select_for_update()`。
2. 读取当前 `biz_status_code`。
3. 查询 `WfTransition`，匹配 `from_status_code + action_code`。
4. 过滤 `status=ENABLED`，按 `priority, id` 排序。
5. 校验是否系统动作、人工动作、角色权限和条件表达式。
6. 选择唯一目标流转。
7. 更新业务对象状态摘要。
8. 写 `TicketStatusLog`。
9. 写 `TicketActionLog`。
10. 按目标状态写 `TicketProgress`。
11. 刷新 `TicketAvailableAction`。
12. 提交事务后触发副作用。

必须保证第 1 到第 11 步在同一个数据库事务中完成。

### 状态摘要更新

执行状态机时，需要同时维护工单运行态冗余字段：

- `biz_status_code`
- `main_status_code`
- `customer_status_code`
- `last_action_code`
- `last_action_at`
- `last_action_by`
- `current_payment_status`
- `current_repair_status`
- `current_fulfillment_status`
- `service_completed_at`
- `closed_at`

其中 `main_status_code`、`customer_status_code` 可从 `WfStatus` 映射得到：

- `WfStatus.main_status_code`
- `WfStatus.customer_status_code`
- `WfStatus.progress_node_code`

### 状态机异常

建议定义明确异常类型：

```text
WorkflowActionNotFound
WorkflowTransitionNotFound
WorkflowPermissionDenied
WorkflowConditionNotMatched
WorkflowSystemOnlyAction
WorkflowStateConflict
WorkflowIdempotencyConflict
```

接口层将异常转换为稳定错误码，避免前端依赖异常文本。

## API 设计

### 工单动作接口

查询可用动作：

```http
GET /api/tickets/{ticket_id}/available-actions
```

执行人工动作：

```http
POST /api/tickets/{ticket_id}/actions/{action_code}
```

请求示例：

```json
{
  "remark": "判定为有偿维修",
  "payload": {
    "repair_fee_amount": "299.00",
    "currency_code": "CNY"
  }
}
```

响应示例：

```json
{
  "ticket_id": 123,
  "ticket_no": "TK202604240001",
  "from_status_code": "RECEIVED",
  "action_code": "SUBMIT_JUDGE_PAID",
  "to_status_code": "JUDGED_PAID",
  "main_status_code": "PROCESSING",
  "customer_status_code": "WAIT_QUOTE_CONFIRM",
  "available_actions": []
}
```

### 内部系统动作接口

供微服务和 `scheduler_worker` 调用：

```http
POST /api/internal/workflow/actions
```

请求示例：

```json
{
  "biz_type": "TICKET",
  "biz_id": 123,
  "action_code": "PAY_SUCCESS",
  "trigger_source": "payment_service",
  "idempotency_key": "evt_202604240001",
  "payload": {
    "payment_order_no": "PY202604240001",
    "payment_status": "PAID",
    "paid_at": "2026-04-24T20:30:00+08:00"
  }
}
```

内部接口必须做服务间鉴权，不能使用普通后台用户权限。

### 支付事件入口

支付服务也可以通过更语义化的入口回写：

```http
POST /api/internal/payment-events
```

`core_api` 收到支付事件后：

1. 校验服务签名。
2. 校验事件幂等。
3. 更新工单支付摘要。
4. 将事件映射为状态机动作。
5. 调用 `WorkflowEngineService.execute_action()`。

事件到动作映射：

| event_type | action_code | 是否必然流转 |
| --- | --- | --- |
| `PAY_SUCCESS` | `PAY_SUCCESS` | 是 |
| `PAY_FAILED` | `PAY_FAILED` | 否，通常只更新支付摘要 |
| `PAY_CLOSED` | `MARK_PAYMENT_CLOSED` | 视业务规则 |
| `REFUND_SUCCESS` | `REFUND_SUCCESS` | 视业务规则 |
| `REFUND_FAILED` | `REFUND_FAILED` | 否 |
| `RECONCILE_DIFF` | 无或 `MARK_PAYMENT_EXCEPTION` | 视业务规则 |

## 支付相关 core_api 处理

`core_api` 不保存支付原始明细，但需要维护工单侧摘要。

建议工单侧支付摘要字段包括：

- `payment_order_no`
- `current_payment_status`
- `payment_amount`
- `payment_method`
- `payment_deadline`
- `paid_at`
- `refund_status`

当前项目已有 `TicketPayment`、`TicketPaymentEventLog`、`TicketRefund`。开发阶段建议：

1. 先保留模型，避免大规模迁移阻塞状态机开发。
2. 将 `TicketPayment` 用作支付摘要兼容层。
3. 新支付明细、原始报文、渠道流水和对账数据放入 `payment_service`。
4. 后续再迁移 `TicketPaymentEventLog` 到 `payment_service`。

## 副作用处理

状态机落库和外部副作用必须解耦。

建议规则：

- 状态变更事务内只写本地数据。
- 调用支付、通知、SAP、物流等外部服务放在事务提交后。
- 外部调用失败不能回滚已经完成的状态变更。
- 外部调用失败时写 `TicketException` 或系统任务表，由 `scheduler_worker` 重试。

典型副作用：

| action_code | 副作用 |
| --- | --- |
| `CREATE_PAYMENT_ORDER` | 调用 `payment_service` 创建支付单 |
| `PAY_SUCCESS` | 通知客户/后台，刷新支付摘要 |
| `SUBMIT_OUTBOUND` | 调用物流或 SAP 出库相关服务 |
| `SYNC_LOGISTICS` | 刷新履约摘要和客户进度 |
| `AUTO_COMPLETE` | 通知客户服务完成 |
| `CANCEL_TICKET` | 根据支付状态决定是否发起退款 |

## 权限策略

人工动作需要校验：

- 当前用户是否登录。
- 用户是否具备动作对应角色。
- `WfActionPermission` 是否允许该角色在当前状态执行动作。
- `WfTransition.role_code` 是否匹配。

系统动作需要校验：

- 调用方是否为受信任微服务。
- `WfTransition.is_system_only=1`。
- `trigger_source` 是否在白名单中，例如 `payment_service`、`scheduler_worker`、`integration_logistics`。

## 条件表达式

`WfTransition.condition_expr` 和 `WfAutoRule.trigger_expr` 不建议一开始做通用脚本执行。第一阶段使用白名单条件编码更安全。

建议实现方式：

```text
condition_expr = "payment_status == PAID"
condition_expr = "delivery_method == STORE_PICKUP"
condition_expr = "repair_fee_amount > 0"
```

由 `WorkflowConditionService` 做有限解析或映射到固定函数，禁止执行任意 Python 代码。

## 幂等策略

人工动作：

- 可选 `Idempotency-Key` 请求头。
- 同一用户、同一工单、同一动作、同一 key 重复请求返回第一次结果。

系统事件：

- 必须传 `idempotency_key`。
- 支付事件优先使用 `event_id`。
- 物流事件可使用 `carrier + tracking_no + event_time + status`。
- 定时任务可使用 `rule_code + biz_type + biz_id + due_time`。

幂等记录建议后续新增独立表：

```text
core_event_idempotency
- id
- idempotency_key
- source
- biz_type
- biz_id
- action_code
- request_hash
- response_snapshot
- status
- created_at
- updated_at
```

## 路由接入

当前 `config.urls.py` 只接入了认证接口。状态机开发时建议增加：

```python
urlpatterns = [
    path("api/auth/", include("accounts.urls")),
    path("api/tickets/", include("tickets.urls")),
    path("api/workflow/", include("workflow.urls")),
    path("api/internal/", include("workflow.internal_urls")),
]
```

也可以将内部接口放在独立 app 或独立 url 文件中，方便网关限制访问。

## 测试计划

单元测试：

- 当前状态没有动作时返回明确错误。
- 人工动作不能执行系统专用流转。
- 系统动作不能执行人工专用流转。
- 权限不足时拒绝。
- 多条流转按优先级选择。
- 条件不满足时不流转。
- 成功流转后写状态日志、动作日志、进度和可用动作。

集成测试：

- `SUBMIT_JUDGE_PAID -> CREATE_PAYMENT_ORDER -> WAIT_PAYMENT`。
- `PAY_SUCCESS -> PAYMENT_COMPLETED`。
- 支付成功事件重复回调只执行一次。
- `MARK_PAYMENT_OVERDUE -> PAYMENT_OVERDUE`。
- `PAY_TIMEOUT_CLOSE -> CLOSED_UNPAID_RETURN`。
- 物流签收事件触发 `SYNC_LOGISTICS`。

并发测试：

- 同一工单两个动作同时执行，只允许一个成功。
- 支付成功和支付超期同时到达时，根据数据库锁和状态机规则保证最终状态正确。

## 开发顺序

1. 新增 `WorkflowEngineService`，完成最小可用状态流转。
2. 新增 `tickets.urls` 和工单动作接口。
3. 新增 `workflow.urls`，支持查询状态、动作、流转配置。
4. 将 `AvailableActionService.refresh()` 接入每次状态变更后。
5. 新增状态日志、动作日志、进度日志统一写入。
6. 新增内部系统动作接口。
7. 新增支付事件入口和支付摘要更新服务。
8. 接入 `payment_service` 创建支付单。
9. 接入 `scheduler_worker` 自动动作。
10. 补齐权限、条件表达式、幂等和异常表。

## 第一阶段最小闭环

第一阶段建议只完成以下闭环：

```text
WAIT_APPLY_REVIEW
  -> APPLY_APPROVE
WAIT_RECEIVE
  -> CONFIRM_RECEIVE
RECEIVED
  -> SUBMIT_JUDGE_PAID
JUDGED_PAID
  -> CREATE_PAYMENT_ORDER
WAIT_PAYMENT
  -> PAY_SUCCESS
PAYMENT_COMPLETED
  -> START_REPAIR
REPAIRING
  -> SUBMIT_REPAIR_DONE
WAIT_OUTBOUND
  -> SUBMIT_OUTBOUND
OUTBOUNDED
  -> SYNC_LOGISTICS
CUSTOMER_SIGNED
  -> AUTO_COMPLETE
```

这个闭环能覆盖人工动作、系统动作、支付事件、物流事件、自动动作和日志进度，是后续扩展库存、咨询、问卷的基础。
