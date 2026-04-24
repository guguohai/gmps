# 工单状态机与支付服务边界设计

## 设计结论

支付能力独立为 `payment_service`。`core_api` 继续作为工单和状态机的事实源，负责状态判定、状态落库、操作日志、进度日志和可用动作刷新；`payment_service` 负责支付订单、支付渠道、回调验签、退款、补偿、对账和支付审计。

这是一种偏长期正确的拆分方式：支付是高安全、高审计、高幂等、高外部依赖的子域，不应该和工单状态机耦合在同一个服务内部。

`core_api` 侧的具体开发方案见 `docs/architecture/core_api_workflow_development_plan.md`。

## 服务职责

### core_api

`core_api` 拥有工单主流程状态。

主要职责：

- 维护 `ticket.biz_status_code`、`ticket.main_status_code`、`ticket.customer_status_code`。
- 维护工单侧支付摘要字段，例如 `current_payment_status`、支付单号、支付金额、支付完成时间。
- 执行状态机动作，例如 `CREATE_PAYMENT_ORDER`、`PAY_SUCCESS`、`PAY_FAILED`、`MARK_PAYMENT_OVERDUE`、`PAY_TIMEOUT_CLOSE`、`REFUND_SUCCESS`。
- 写入 `TicketStatusLog`、`TicketActionLog`、`TicketProgress`。
- 刷新 `TicketAvailableAction`。
- 向 `payment_service` 发起创建支付单、关闭支付单、退款申请等业务请求。
- 接收 `payment_service` 的支付结果事件，并通过状态机动作更新工单。

`core_api` 不直接对接微信、支付宝或其他支付渠道，不保存支付原始回调报文，不承担支付对账。

### payment_service

`payment_service` 拥有支付域的完整明细和审计。

主要职责：

- 创建支付订单。
- 生成支付链接、二维码或小程序支付参数。
- 对接微信、支付宝或其他支付渠道。
- 处理支付回调并完成验签。
- 处理支付结果幂等。
- 查询支付渠道订单状态。
- 执行支付补偿任务。
- 发起退款与处理退款回调。
- 拉取和解析对账文件。
- 保存支付请求、响应、回调、补偿、退款、对账差异等原始记录。
- 将支付领域事件回写给 `core_api`。

`payment_service` 不直接修改工单状态，不直接写 `ticket` 表。

### scheduler_worker

`scheduler_worker` 负责任务触发，不拥有业务状态。

主要职责：

- 根据 `wf_auto_rule` 触发工单自动动作，例如支付超期、超期关闭、自动完成。
- 调用 `payment_service` 做支付补偿查询。
- 根据补偿结果调用 `core_api` 的状态机动作接口。

## 数据归属

### core_api 保留的数据

工单侧只保留支付摘要，用于列表、详情、筛选和状态机判断：

- `ticket.current_payment_status`
- `payment_order_no`
- `payment_amount`
- `payment_method`
- `paid_at`
- `payment_deadline`
- `refund_status`

当前项目中 `TicketPayment`、`TicketPaymentEventLog`、`TicketRefund` 已经在 `core_api` 内。最优演进方式是：

1. 短期保留这些表作为工单侧支付摘要和兼容层。
2. 新增 `payment_service` 后，支付明细以 `payment_service` 为准。
3. 后续迁移时，将 `TicketPaymentEventLog` 和支付原始报文类字段迁出 `core_api`。
4. `core_api` 最终只保留支付摘要或支付快照。

### payment_service 拥有的数据

支付服务建议拥有独立表：

- `payment_order`
- `payment_order_event`
- `payment_callback_log`
- `payment_refund`
- `payment_refund_event`
- `payment_reconciliation_file`
- `payment_reconciliation_diff`
- `payment_idempotency_key`

其中原始请求、响应、回调报文、验签结果、渠道流水号、补偿查询结果、对账差异都属于 `payment_service`。

## 推荐状态流

```text
JUDGED_PAID
  -- CREATE_PAYMENT_ORDER -->
WAIT_PAYMENT
  -- PAY_SUCCESS -->
PAYMENT_COMPLETED
  -- MARK_PAYMENT_OVERDUE -->
PAYMENT_OVERDUE
  -- PAY_TIMEOUT_CLOSE -->
CLOSED_UNPAID_RETURN
```

退款不建议默认改变工单主线状态。退款先作为支付子状态处理，只有业务明确要求时才触发工单状态机动作。

支付子状态建议：

```text
PENDING
PAYING
PAID
PAY_FAILED
CLOSED
REFUNDING
REFUNDED
REFUND_FAILED
RECONCILE_DIFF
```

## 接口契约

### core_api 调用 payment_service

创建支付单：

```http
POST /api/v1/payment-orders
```

请求字段建议：

```json
{
  "biz_type": "TICKET",
  "biz_id": 123,
  "biz_no": "TK202604240001",
  "payment_order_no": "PY202604240001",
  "amount": "299.00",
  "currency": "CNY",
  "subject": "维修服务费",
  "expire_at": "2026-05-23T23:59:59+08:00",
  "notify_url": "https://core-api.example.com/api/internal/payment-events"
}
```

查询支付单：

```http
GET /api/v1/payment-orders/{payment_order_no}
```

关闭支付单：

```http
POST /api/v1/payment-orders/{payment_order_no}/close
```

申请退款：

```http
POST /api/v1/refunds
```

### payment_service 回写 core_api

支付服务只通过 `core_api` 的内部支付事件入口或状态机动作入口回写。

推荐入口：

```http
POST /api/internal/payment-events
```

事件字段建议：

```json
{
  "event_id": "evt_202604240001",
  "event_type": "PAY_SUCCESS",
  "biz_type": "TICKET",
  "biz_id": 123,
  "biz_no": "TK202604240001",
  "payment_order_no": "PY202604240001",
  "payment_status": "PAID",
  "amount": "299.00",
  "paid_at": "2026-04-24T20:30:00+08:00",
  "channel": "WECHAT",
  "channel_trade_no": "420000000000000001"
}
```

`core_api` 收到后必须转换成状态机动作执行，例如：

```text
PAY_SUCCESS -> WAIT_PAYMENT 到 PAYMENT_COMPLETED
PAY_FAILED -> 只更新支付摘要，不一定流转主状态
REFUND_SUCCESS -> 更新退款摘要，必要时触发工单动作
```

## 幂等与一致性

- `payment_service` 以 `payment_order_no`、渠道流水号、回调通知 ID 做支付域幂等。
- `core_api` 以 `event_id` 或 `payment_order_no + event_type + channel_trade_no` 做事件幂等。
- 所有工单状态变更必须经 `WorkflowEngineService.execute_action`。
- 微服务不能绕过 `core_api` 直接写工单表。
- `core_api` 调用 `payment_service` 成功后，先更新工单支付摘要，再进入 `WAIT_PAYMENT`。
- `payment_service` 回写失败时必须重试，重试仍然保证事件幂等。

## 开发顺序

1. 在 `core_api` 实现通用状态机动作执行服务。
2. 新增 `payment_service` 服务骨架和支付订单模型。
3. 在 `core_api` 增加支付事件内部入口。
4. 将 `CREATE_PAYMENT_ORDER` 动作接入 `payment_service`。
5. 将支付成功、支付失败、退款成功事件接入状态机。
6. 将支付超期和支付补偿放入 `scheduler_worker`。
7. 最后迁移 `core_api` 中的支付事件明细和原始报文到 `payment_service`。
