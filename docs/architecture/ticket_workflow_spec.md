# 工单状态机规格

## 结论

当前项目已经在初始化 SQL 中定义了较完整的工单状态、动作和部分流转，但现有架构文档更侧重服务边界、支付拆分和 `core_api` 执行框架，还没有把工单状态机本身完整展开。

本文档用于承接工单主流程的状态、动作、流转和缺口清单。后续开发 `WorkflowEngineService`、接口和测试用例时，以本文档作为业务规格入口。

初始化 SQL 的使用方式和治理建议见 `docs/architecture/init_sql_usage_plan.md`。

## 状态分层

工单状态分三层：

- 主状态：用于后台和统计聚合，例如受理、接收、判定、支付、处理、履约、完成、关闭。
- 客户展示状态：用于小程序或客户侧展示，例如申请处理中、待接收、检测中、待支付、处理中、返还中、已完成、已关闭。
- 业务状态：状态机实际流转使用的细粒度状态，即 `ticket.biz_status_code`。

状态机执行时，以业务状态为准，并同步刷新主状态和客户展示状态。

## 主状态

| 状态码 | 含义 |
| --- | --- |
| `MAIN_APPLY` | 受理 |
| `MAIN_RECEIVE` | 接收 |
| `MAIN_JUDGE` | 判定 |
| `MAIN_PAYMENT` | 支付 |
| `MAIN_PROCESS` | 处理 |
| `MAIN_FULFILLMENT` | 履约 |
| `MAIN_COMPLETED` | 完成 |
| `MAIN_CLOSED` | 关闭 |

## 客户展示状态

| 状态码 | 含义 |
| --- | --- |
| `CUSTOMER_APPLYING` | 申请处理中 |
| `CUSTOMER_WAIT_RECEIVE` | 待接收 |
| `CUSTOMER_INSPECTING` | 检测中 |
| `CUSTOMER_WAIT_PAYMENT` | 待支付 |
| `CUSTOMER_PROCESSING` | 处理中 |
| `CUSTOMER_DELIVERING` | 返还中 |
| `CUSTOMER_COMPLETED` | 已完成 |
| `CUSTOMER_CLOSED` | 已关闭 |

## 业务状态

| 状态码 | 主状态 | 客户展示状态 | 说明 |
| --- | --- | --- | --- |
| `WAIT_APPLY_REVIEW` | `MAIN_APPLY` | `CUSTOMER_APPLYING` | 待申请审核，初始状态 |
| `APPLY_REJECTED` | `MAIN_CLOSED` | `CUSTOMER_CLOSED` | 申请审核驳回，终态 |
| `WAIT_RECEIVE` | `MAIN_RECEIVE` | `CUSTOMER_WAIT_RECEIVE` | 待接收产品 |
| `RECEIVED` | `MAIN_JUDGE` | `CUSTOMER_INSPECTING` | 已接收，待检测判定 |
| `WAIT_JUDGE` | `MAIN_JUDGE` | `CUSTOMER_INSPECTING` | 待判定，当前 SQL 已定义但未接入流转 |
| `JUDGED_COMPLETED` | `MAIN_JUDGE` | `CUSTOMER_INSPECTING` | 判定完成中间态，当前 SQL 已定义但未接入流转 |
| `JUDGED_FREE` | `MAIN_PROCESS` | `CUSTOMER_PROCESSING` | 判定无偿 |
| `JUDGED_PAID` | `MAIN_PAYMENT` | `CUSTOMER_WAIT_PAYMENT` | 判定有偿 |
| `WAIT_PAYMENT` | `MAIN_PAYMENT` | `CUSTOMER_WAIT_PAYMENT` | 付款待机 |
| `PAYMENT_OVERDUE` | `MAIN_PAYMENT` | `CUSTOMER_WAIT_PAYMENT` | 支付逾期 |
| `PAYMENT_COMPLETED` | `MAIN_PROCESS` | `CUSTOMER_PROCESSING` | 支付完成 |
| `WAIT_REPAIR` | `MAIN_PROCESS` | `CUSTOMER_PROCESSING` | 待处理，当前 SQL 已定义但未接入流转 |
| `REPAIRING` | `MAIN_PROCESS` | `CUSTOMER_PROCESSING` | 处理中 |
| `WAIT_PARTS` | `MAIN_PROCESS` | `CUSTOMER_PROCESSING` | 等待配件 |
| `WAIT_OUTBOUND` | `MAIN_FULFILLMENT` | `CUSTOMER_PROCESSING` | 待出库 |
| `OUTBOUNDED` | `MAIN_FULFILLMENT` | `CUSTOMER_DELIVERING` | 已出库 |
| `DELIVERING` | `MAIN_FULFILLMENT` | `CUSTOMER_DELIVERING` | 配送中 |
| `STORE_ARRIVED` | `MAIN_FULFILLMENT` | `CUSTOMER_DELIVERING` | 门店到货 |
| `STORE_RECEIVED` | `MAIN_FULFILLMENT` | `CUSTOMER_DELIVERING` | 门店收货完成 |
| `STORE_READY_PICKUP` | `MAIN_FULFILLMENT` | `CUSTOMER_DELIVERING` | 门店可取 |
| `CUSTOMER_SIGNED` | `MAIN_COMPLETED` | `CUSTOMER_COMPLETED` | 客户签收完成 |
| `CUSTOMER_PICKED` | `MAIN_COMPLETED` | `CUSTOMER_COMPLETED` | 客户取件完成 |
| `COMPLETED` | `MAIN_COMPLETED` | `CUSTOMER_COMPLETED` | 服务完成，终态 |
| `REFUND_PROCESSING` | `MAIN_CLOSED` | `CUSTOMER_CLOSED` | 退款处理中，当前 SQL 已定义但缺少动作和流转 |
| `REFUND_COMPLETED` | `MAIN_CLOSED` | `CUSTOMER_CLOSED` | 退款完成，当前 SQL 已定义但缺少动作和流转 |
| `CLOSED_UNPAID_RETURN` | `MAIN_CLOSED` | `CUSTOMER_CLOSED` | 未付款退回关闭，终态 |
| `CLOSED_CANCELED` | `MAIN_CLOSED` | `CUSTOMER_CLOSED` | 取消关闭，终态 |

## 动作清单

| 动作码 | 类型 | 说明 |
| --- | --- | --- |
| `APPLY_APPROVE` | `MANUAL` | 申请审核通过 |
| `APPLY_REJECT` | `MANUAL` | 申请审核驳回 |
| `CONFIRM_RECEIVE` | `MANUAL` | 确认收到产品 |
| `SUBMIT_JUDGE_FREE` | `MANUAL` | 提交无偿判定 |
| `SUBMIT_JUDGE_PAID` | `MANUAL` | 提交有偿判定 |
| `CREATE_PAYMENT_ORDER` | `MANUAL` | 生成支付单 |
| `PAY_SUCCESS` | `API` | 支付成功回写 |
| `MARK_PAYMENT_OVERDUE` | `JOB` | 标记支付逾期 |
| `PAY_TIMEOUT_CLOSE` | `JOB` | 支付超时关闭 |
| `START_REPAIR` | `MANUAL` | 开始处理 |
| `AUTO_START_REPAIR` | `JOB` | 自动进入处理 |
| `MARK_WAIT_PARTS` | `MANUAL` | 标记等待配件 |
| `PARTS_ARRIVED` | `MANUAL` | 配件到齐继续处理 |
| `SUBMIT_REPAIR_DONE` | `MANUAL` | 提交处理完成 |
| `PREPARE_OUTBOUND` | `MANUAL` | 出库准备完成 |
| `SUBMIT_OUTBOUND` | `MANUAL` | 提交出库 |
| `SYNC_LOGISTICS` | `API` | 物流状态回写 |
| `CONFIRM_STORE_RECEIVE` | `MANUAL` | 确认门店收货 |
| `MARK_STORE_READY_PICKUP` | `MANUAL` | 标记门店可取 |
| `CONFIRM_CUSTOMER_PICKUP` | `MANUAL` | 确认客户取件 |
| `AUTO_COMPLETE` | `JOB` | 自动服务完成 |
| `CANCEL_TICKET` | `MANUAL` | 取消工单 |

## 当前已定义流转

### 申请与接收

| 当前状态 | 动作 | 目标状态 | 触发方 |
| --- | --- | --- | --- |
| `WAIT_APPLY_REVIEW` | `APPLY_APPROVE` | `WAIT_RECEIVE` | 人工 |
| `WAIT_APPLY_REVIEW` | `APPLY_REJECT` | `APPLY_REJECTED` | 人工 |
| `WAIT_RECEIVE` | `CONFIRM_RECEIVE` | `RECEIVED` | 人工 |
| `WAIT_RECEIVE` | `CANCEL_TICKET` | `CLOSED_CANCELED` | 人工 |

### 判定与支付

| 当前状态 | 动作 | 目标状态 | 触发方 |
| --- | --- | --- | --- |
| `RECEIVED` | `SUBMIT_JUDGE_FREE` | `JUDGED_FREE` | 人工 |
| `RECEIVED` | `SUBMIT_JUDGE_PAID` | `JUDGED_PAID` | 人工 |
| `RECEIVED` | `CANCEL_TICKET` | `CLOSED_CANCELED` | 人工 |
| `JUDGED_PAID` | `CREATE_PAYMENT_ORDER` | `WAIT_PAYMENT` | 人工 |
| `WAIT_PAYMENT` | `PAY_SUCCESS` | `PAYMENT_COMPLETED` | 支付服务 |
| `WAIT_PAYMENT` | `MARK_PAYMENT_OVERDUE` | `PAYMENT_OVERDUE` | 定时任务 |
| `PAYMENT_OVERDUE` | `PAY_TIMEOUT_CLOSE` | `CLOSED_UNPAID_RETURN` | 定时任务 |

### 处理

| 当前状态 | 动作 | 目标状态 | 触发方 |
| --- | --- | --- | --- |
| `JUDGED_FREE` | `START_REPAIR` | `REPAIRING` | 人工 |
| `PAYMENT_COMPLETED` | `START_REPAIR` | `REPAIRING` | 人工 |
| `JUDGED_FREE` | `AUTO_START_REPAIR` | `REPAIRING` | 定时任务 |
| `PAYMENT_COMPLETED` | `AUTO_START_REPAIR` | `REPAIRING` | 定时任务 |
| `REPAIRING` | `MARK_WAIT_PARTS` | `WAIT_PARTS` | 人工 |
| `WAIT_PARTS` | `PARTS_ARRIVED` | `REPAIRING` | 人工 |
| `REPAIRING` | `SUBMIT_REPAIR_DONE` | `WAIT_OUTBOUND` | 人工 |

### 履约

| 当前状态 | 动作 | 目标状态 | 触发方 |
| --- | --- | --- | --- |
| `WAIT_OUTBOUND` | `PREPARE_OUTBOUND` | `WAIT_OUTBOUND` | 人工 |
| `WAIT_OUTBOUND` | `SUBMIT_OUTBOUND` | `OUTBOUNDED` | 人工 |
| `OUTBOUNDED` | `SYNC_LOGISTICS` | `DELIVERING` | 物流服务 |
| `DELIVERING` | `SYNC_LOGISTICS` | `CUSTOMER_SIGNED` | 物流服务 |
| `STORE_ARRIVED` | `CONFIRM_STORE_RECEIVE` | `STORE_RECEIVED` | 人工 |
| `STORE_RECEIVED` | `MARK_STORE_READY_PICKUP` | `STORE_READY_PICKUP` | 人工 |
| `STORE_READY_PICKUP` | `CONFIRM_CUSTOMER_PICKUP` | `CUSTOMER_PICKED` | 人工 |

### 完成

| 当前状态 | 动作 | 目标状态 | 触发方 |
| --- | --- | --- | --- |
| `CUSTOMER_SIGNED` | `AUTO_COMPLETE` | `COMPLETED` | 定时任务 |
| `CUSTOMER_PICKED` | `AUTO_COMPLETE` | `COMPLETED` | 定时任务 |

## 当前自动规则

| 规则码 | 当前状态 | 动作 | 时间规则 |
| --- | --- | --- | --- |
| `RULE_FREE_AUTO_START_REPAIR` | `JUDGED_FREE` | `AUTO_START_REPAIR` | 工作日 D+3 |
| `RULE_PAID_AUTO_START_REPAIR` | `PAYMENT_COMPLETED` | `AUTO_START_REPAIR` | 工作日 D+3 |
| `RULE_MARK_PAYMENT_OVERDUE` | `WAIT_PAYMENT` | `MARK_PAYMENT_OVERDUE` | 自然日 D+29 |
| `RULE_PAY_TIMEOUT_CLOSE` | `PAYMENT_OVERDUE` | `PAY_TIMEOUT_CLOSE` | 自然日 D+1 |
| `RULE_SIGNED_AUTO_COMPLETE` | `CUSTOMER_SIGNED` | `AUTO_COMPLETE` | 工作日 D+1 |
| `RULE_PICKED_AUTO_COMPLETE` | `CUSTOMER_PICKED` | `AUTO_COMPLETE` | 工作日 D+1 |

## 当前缺口

以下是从现有 SQL 对照出来的缺口，不一定都是必须开发，但需要业务确认。

| 缺口 | 说明 | 建议 |
| --- | --- | --- |
| `WAIT_JUDGE` 未接入 | 状态已定义，但没有进入或离开它的流转 | 如果需要“已接收”和“待判定”分开，应增加 `RECEIVED -> WAIT_JUDGE` 或将判定动作改从 `WAIT_JUDGE` 发起 |
| `JUDGED_COMPLETED` 未接入 | 状态已定义，但没有流转 | 如无明确业务含义，建议删除或暂不启用 |
| `WAIT_REPAIR` 未接入 | 状态已定义，但当前直接从 `JUDGED_FREE` / `PAYMENT_COMPLETED` 到 `REPAIRING` | 如需要派工等待，应增加 `WAIT_REPAIR`，再由工程师开始处理 |
| 门店取件路径缺入口 | 有 `STORE_ARRIVED -> STORE_RECEIVED -> STORE_READY_PICKUP -> CUSTOMER_PICKED`，但没有从物流状态进入 `STORE_ARRIVED` 的流转 | 增加 `DELIVERING -> STORE_ARRIVED`，动作可继续使用 `SYNC_LOGISTICS`，通过物流事件条件区分 |
| 直邮签收和门店自提未用条件区分 | `DELIVERING + SYNC_LOGISTICS` 当前只到 `CUSTOMER_SIGNED` | 增加 `condition_expr`，按 `delivery_method` 或物流事件类型选择目标状态 |
| 支付失败动作缺失 | 有 `PAY_SUCCESS`，没有 `PAY_FAILED` | 支付失败通常只更新支付摘要，可不流转；但建议定义动作或事件处理策略 |
| 支付关闭动作缺失 | 有超期关闭，但没有支付单主动关闭/渠道关闭 | 增加 `PAY_CLOSED` 或 `MARK_PAYMENT_CLOSED` |
| 退款流转缺失 | `REFUND_PROCESSING`、`REFUND_COMPLETED` 已定义，但没有动作和流转 | 增加 `APPLY_REFUND`、`REFUND_SUCCESS`、`REFUND_FAILED` 等动作 |
| 取消范围偏窄 | 当前只允许 `WAIT_RECEIVE`、`RECEIVED` 取消 | 需要确认有偿支付后、维修中、出库前取消如何处理，是否进入退款 |
| 支付单创建动作类型偏人工 | `CREATE_PAYMENT_ORDER` 当前是人工动作 | 支付独立后建议作为人工触发的业务动作，但外部副作用由 `core_api` 调用 `payment_service`；也可拆成 `REQUEST_PAYMENT` 和系统内部 `PAYMENT_ORDER_CREATED` |
| `PREPARE_OUTBOUND` 是自循环 | `WAIT_OUTBOUND -> WAIT_OUTBOUND` | 需要确认是否只记录动作日志，还是应该有 `OUTBOUND_READY` 状态 |

## 建议补齐后的关键流转

### 判定等待态

如业务需要显式派单判定：

```text
RECEIVED -- ASSIGN_JUDGE --> WAIT_JUDGE
WAIT_JUDGE -- SUBMIT_JUDGE_FREE --> JUDGED_FREE
WAIT_JUDGE -- SUBMIT_JUDGE_PAID --> JUDGED_PAID
```

如果不需要，则建议不使用 `WAIT_JUDGE`。

### 待处理态

如业务需要派工或等待工程师接单：

```text
JUDGED_FREE -- READY_REPAIR --> WAIT_REPAIR
PAYMENT_COMPLETED -- READY_REPAIR --> WAIT_REPAIR
WAIT_REPAIR -- START_REPAIR --> REPAIRING
```

如果不需要，则当前直接进入 `REPAIRING` 可以保留。

### 门店自提履约

```text
OUTBOUNDED -- SYNC_LOGISTICS --> DELIVERING
DELIVERING -- SYNC_LOGISTICS[store_arrived] --> STORE_ARRIVED
STORE_ARRIVED -- CONFIRM_STORE_RECEIVE --> STORE_RECEIVED
STORE_RECEIVED -- MARK_STORE_READY_PICKUP --> STORE_READY_PICKUP
STORE_READY_PICKUP -- CONFIRM_CUSTOMER_PICKUP --> CUSTOMER_PICKED
CUSTOMER_PICKED -- AUTO_COMPLETE --> COMPLETED
```

### 直邮履约

```text
OUTBOUNDED -- SYNC_LOGISTICS --> DELIVERING
DELIVERING -- SYNC_LOGISTICS[customer_signed] --> CUSTOMER_SIGNED
CUSTOMER_SIGNED -- AUTO_COMPLETE --> COMPLETED
```

### 支付与退款

```text
WAIT_PAYMENT -- PAY_SUCCESS --> PAYMENT_COMPLETED
WAIT_PAYMENT -- MARK_PAYMENT_OVERDUE --> PAYMENT_OVERDUE
PAYMENT_OVERDUE -- PAY_TIMEOUT_CLOSE --> CLOSED_UNPAID_RETURN
```

需要取消且已支付时，建议引入退款子流程：

```text
PAYMENT_COMPLETED -- CANCEL_TICKET --> REFUND_PROCESSING
REFUND_PROCESSING -- REFUND_SUCCESS --> REFUND_COMPLETED
REFUND_PROCESSING -- REFUND_FAILED --> REFUND_PROCESSING
```

是否让 `REFUND_COMPLETED` 成为工单终态，需要业务确认。

## 第一阶段建议范围

第一阶段不要试图一次补齐所有边界。建议先做主流程闭环：

```text
WAIT_APPLY_REVIEW
WAIT_RECEIVE
RECEIVED
JUDGED_FREE / JUDGED_PAID
WAIT_PAYMENT
PAYMENT_COMPLETED
REPAIRING
WAIT_PARTS
WAIT_OUTBOUND
OUTBOUNDED
DELIVERING
CUSTOMER_SIGNED / CUSTOMER_PICKED
COMPLETED
CLOSED_CANCELED
CLOSED_UNPAID_RETURN
```

暂缓或灰度启用：

- `WAIT_JUDGE`
- `JUDGED_COMPLETED`
- `WAIT_REPAIR`
- `REFUND_PROCESSING`
- `REFUND_COMPLETED`

这些状态可以保留在配置中，但不要在前端或接口层暴露为可选人工状态，直到业务规则明确。
