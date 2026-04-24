# 小程序查询工单详情接口实现说明

## 对应需求

需求来源：

```text
docs/api/GM 小程序协同接口需求文档.md
3.3 查询工单详情接口
```

接口用于小程序在收到统一业务通知后，主动向 `core_api` 拉取工单聚合详情。统一业务通知只传递“哪个工单发生了什么事件”，小程序展示所需的最新状态、支付、确认、问卷、物流和进度信息均通过本接口获取。

## 接口定义

```http
GET /api/miniapp/tickets/{ticketNo}/detail
```

查询参数：

| 参数 | 必填 | 说明 |
| --- | --- | --- |
| `mobile` | 是 | 客户手机号，用于校验工单归属 |
| `language` | 否 | 展示语言，支持 `zh-CN`、`en`、`ko`，默认 `zh-CN` |

当前实现文件：

```text
apps/core_api/tickets/views.py
apps/core_api/tickets/urls.py
apps/core_api/config/urls.py
```

## 当前实现范围

当前接口已返回以下聚合结构：

- 工单基础状态：`ticketNo`、`status`、`displayStatus`、`statusDesc`、`progressStage`
- 服务进展：`serviceProgress`
- 关键时间节点：`timeNodes`
- 产品与问题描述：`productName`、`issueDescription`
- 维修摘要：`judgementResult`、`repairContent`、`expectedOutboundDate`
- 寄回信息：`returnMode`、`returnAddressText`
- 客户侧能力：`canModifyReturnMode`、`canModifyReturnAddress`、`canCancel`、`actions`
- 支付信息：`payment`
- 客户确认信息：`confirmation`
- 问卷摘要：`survey`
- 物流摘要：`logistics`
- 维修进展轨迹：`progressRecords`

返回结构统一为：

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

## 数据来源

| 返回模块 | 数据来源 |
| --- | --- |
| 工单状态 | `tickets.Ticket`、`workflow.WfStatus` |
| 产品和问题描述 | `tickets.TicketSnapshot`、`master_data.Product` |
| 维修摘要 | `tickets.TicketRepair` |
| 支付信息 | `tickets.TicketPayment`、`tickets.TicketRepair` |
| 客户确认 | `tickets.TicketConsultation`、`tickets.TicketConsultationAttachment` |
| 问卷摘要 | `surveys.SurveyTask` |
| 物流摘要 | `tickets.TicketFulfillment`、`tickets.TicketInboundLogistics` |
| 服务进展/轨迹 | `tickets.TicketProgress` |

## 归属校验

当前按以下规则校验工单归属：

1. 根据 `ticketNo` 查询未删除工单。
2. 优先读取 `TicketSnapshot.customer_phone`。
3. 如果没有快照，则读取 `Ticket.customer.customer_phone`。
4. 与请求参数 `mobile` 比对，不一致时返回：

```json
{
  "code": 403,
  "message": "ticket does not belong to this mobile",
  "data": null
}
```

后续接入小程序用户身份令牌或服务签名后，应从 token 中解析客户身份，再与 `mobile` 或客户 ID 做一致性校验。

## 客户侧 actions 口径

`actions` 只返回小程序客户侧可操作项，不返回后台内部动作。

当前支持：

| actionCode | 说明 | 触发条件 |
| --- | --- | --- |
| `SUBMIT_SHIPPING` | 提交寄件信息 | `WAIT_RECEIVE` |
| `PAY` | 去支付 | `WAIT_PAYMENT` |
| `CANCEL` | 取消工单 | `WAIT_RECEIVE`、`RECEIVED` |
| `CONFIRM` | 处理客户确认事项 | 存在 `WAIT_CONFIRM` 客户确认事项 |
| `SUBMIT_SURVEY` | 填写问卷 | 存在待提交问卷 |

注意：不要直接把 `TicketAvailableAction` 全量返回给小程序，否则会暴露后台动作，例如开始维修、提交出库等。

## 当前限制

- 鉴权暂按 `mobile` 查询参数做归属校验，尚未接入小程序身份令牌或请求签名。
- 支付服务独立后，`payment` 模块应优先从支付服务或支付摘要表读取。
- 物流完整轨迹当前未展开，只返回摘要字段；完整轨迹后续应由物流服务或轨迹表补齐。
- `judgementResult` 当前根据状态和支付状态做基础推断，后续应以维修判定结果字段为准。
- 客户侧可修改寄回地址/方式的规则当前按状态粗粒度判断，后续应抽到统一能力计算服务。

## 后续建议

1. 增加小程序请求签名或用户 token 鉴权。
2. 抽出 `MiniAppTicketDetailService`，让 view 只负责参数和响应。
3. 补充接口测试，覆盖成功、工单不存在、手机号不匹配、空子模块等场景。
4. 与支付服务完成边界后，调整 `payment` 模块数据来源。
5. 与物流服务完成边界后，增加完整物流轨迹。

