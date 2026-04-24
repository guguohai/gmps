# 支付服务

`payment_service` 是 PS 系统中独立的支付领域服务。

支付服务负责支付订单、支付渠道、回调验签、退款、补偿查询、对账、幂等和支付审计日志。它不直接修改工单状态，支付结果需要回写 `core_api`，由 `core_api` 通过工单状态机执行对应动作。

## 职责

`payment_service` 负责：

- 创建支付订单。
- 维护支付订单生命周期。
- 对接微信支付、支付宝或其他支付渠道。
- 处理支付渠道回调和签名校验。
- 处理支付回调、退款回调和补偿查询的幂等。
- 发起退款和处理退款结果。
- 拉取、解析和处理支付对账文件。
- 保存支付请求、响应、回调、退款、补偿和对账原始日志。
- 将支付领域事件回写给 `core_api`。

## 边界

支付服务拥有：

- 支付订单明细。
- 支付渠道流水。
- 支付原始请求和响应。
- 支付回调原始报文。
- 退款记录和退款回调。
- 补偿查询记录。
- 对账文件和对账差异。
- 支付幂等记录。

`core_api` 拥有：

- 工单主流程状态。
- 工单侧支付摘要字段。
- 工单状态机动作执行。
- 工单状态日志、动作日志、进度日志和可用动作。

支付服务不能直接写 `ticket` 表，也不能直接修改 `ticket.biz_status_code`。

## 建议接口

支付服务对外提供：

```http
POST /api/v1/payment-orders
GET /api/v1/payment-orders/{payment_order_no}
POST /api/v1/payment-orders/{payment_order_no}/close
POST /api/v1/refunds
GET /api/v1/refunds/{refund_no}
```

支付服务回写 `core_api`：

```http
POST /api/internal/payment-events
```

## 事件类型

支付服务回写 `core_api` 时，建议使用稳定事件类型：

- `PAY_SUCCESS`
- `PAY_FAILED`
- `PAY_CLOSED`
- `REFUND_SUCCESS`
- `REFUND_FAILED`
- `RECONCILE_DIFF`

`core_api` 根据事件类型和当前工单状态决定是否触发工单状态流转。

## 实现约定

- 使用 `payment_order_no` 作为支付订单业务主键。
- 支付渠道原始报文只保存在支付服务中，不写入 `core_api`。
- 回调、退款和补偿查询必须做幂等。
- 回写 `core_api` 失败时需要重试，直到 `core_api` 确认接收。
- `core_api` 是工单状态事实源，支付服务是支付状态事实源。

