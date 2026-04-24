# 消息通知服务

`notification_service` 是 PS 系统的独立通知服务，负责短信、邮件、小程序消息和系统内通知等消息分发能力。

通知服务只负责“发送消息”和“记录发送结果”，不负责决定工单状态，也不能直接修改工单。工单状态变化仍以 `core_api` 的状态机为准。

## 服务边界

通知服务负责：

- 查询和渲染通知模板。
- 发送短信、邮件、小程序消息、系统通知。
- 将发送任务放入异步队列。
- 处理发送重试。
- 记录通知发送日志。
- 提供模板查询和发送日志查询接口。

通知服务不负责：

- 修改工单状态。
- 判断工单是否允许流转。
- 直接执行业务动作。
- 保存工单主数据。
- 决定支付、物流、维修等业务结果。

## 与 core_api 的关系

`core_api` 是工单状态和状态机的事实源。推荐调用链路：

```text
用户/微服务/定时任务
  -> core_api 执行状态机动作
  -> core_api 提交事务
  -> core_api 根据动作和状态触发通知服务
  -> notification_service 异步发送
  -> notification_service 记录发送日志
```

通知服务失败不能回滚已经完成的工单状态流转。发送失败应记录日志，并由队列重试或人工补发。

## 技术栈

- Web 框架：FastAPI
- 数据库：MySQL 8
- 任务队列：Celery + Redis
- 鉴权方式：JWT 或服务间签名
- 小程序推送：HTTP Webhook + 签名

## 当前接口

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` | `/health` | 健康检查 |
| `POST` | `/api/v1/notifications/send` | 按模板发送单条通知 |
| `GET` | `/api/v1/notifications/templates` | 查询通知模板 |
| `GET` | `/api/v1/notifications/logs` | 查询发送日志 |
| `POST` | `/api/v1/miniapp/push` | 触发小程序统一消息推送 |

服务启动后可访问：

- Swagger UI: `http://localhost:8001/docs`
- ReDoc: `http://localhost:8001/redoc`

## 推荐发送接口

`core_api` 调用通知服务时，建议使用统一发送接口：

```http
POST /api/v1/notifications/send
```

请求示例：

```json
{
  "message_id": "msg_202604240001",
  "template_code": "TICKET_PAYMENT_SUCCESS_MINI_PROGRAM",
  "channel": "MINI_PROGRAM",
  "receiver": "openid_or_phone",
  "receiver_type": "CUSTOMER",
  "biz_type": "TICKET",
  "biz_id": 123,
  "biz_no": "TK202604240001",
  "event_code": "PAY_SUCCESS",
  "event_name": "支付成功",
  "event_time": "2026-04-24T20:30:00+08:00",
  "variables": {
    "ticket_no": "TK202604240001",
    "tracking_no": "SF123456789"
  }
}
```

`message_id` 必须全局唯一，用于幂等控制。重复请求会返回已存在发送记录，不会重复创建发送任务。

## 模板来源

通知模板保存在 `notification_template` 表中，初始化数据位于：

```text
infra/sql/init-sql/10_init_notification_template.sql
```

当前已有模板：

| 模板编码 | 场景 | 触发节点 |
| --- | --- | --- |
| `TICKET_PAYMENT_SUCCESS_MINI_PROGRAM` | 支付成功通知 | `PAY_SUCCESS` |
| `TICKET_OUTBOUND_MINI_PROGRAM` | 发货通知 | `SUBMIT_OUTBOUND` |
| `TICKET_COMPLETED_MINI_PROGRAM` | 服务完成通知 | `AUTO_COMPLETE` |
| `SURVEY_REMIND_MINI_PROGRAM` | 问卷提醒通知 | `SURVEY_CREATE` |
| `TICKET_CUSTOMER_CONFIRM_MINI_PROGRAM` | 客户确认事项通知 | `WAIT_CONFIRM` |

## 模板变量规范

模板变量统一使用双大括号：

```text
{{ticket_no}}
{{tracking_no}}
{{survey_no}}
```

不建议混用 `{ticket_no}` 或 `${ticket_no}`。后续应统一修正初始化 SQL 和渲染逻辑，避免模板变量无法替换。

## 状态机事件到通知模板

建议由 `core_api` 根据状态机动作选择模板。

| 动作或事件 | 推荐模板 | 说明 |
| --- | --- | --- |
| `PAY_SUCCESS` | `TICKET_PAYMENT_SUCCESS_MINI_PROGRAM` | 支付成功 |
| `SUBMIT_OUTBOUND` | `TICKET_OUTBOUND_MINI_PROGRAM` | 发货/出库 |
| `AUTO_COMPLETE` | `TICKET_COMPLETED_MINI_PROGRAM` | 服务完成 |
| `SURVEY_CREATE` | `SURVEY_REMIND_MINI_PROGRAM` | 问卷创建后提醒 |
| `WAIT_CONFIRM` | `TICKET_CUSTOMER_CONFIRM_MINI_PROGRAM` | 客户确认事项 |

建议补充模板：

- 待支付通知。
- 支付逾期提醒。
- 门店到货通知。
- 门店可取通知。
- 工单取消/关闭通知。
- 退款成功通知。
- 退款失败通知。
- 等待配件通知。

## 幂等策略

通知发送必须支持幂等：

- `message_id` 作为唯一业务键。
- 重复 `message_id` 不应重复发送。
- 若第一次发送成功，重复请求直接返回成功结果。
- 若第一次发送失败，可按重试策略继续发送。

数据库表 `notification_send_log` 已定义 `message_id` 唯一键，应以此作为幂等基础。

## 重试策略

小程序推送当前通过 Celery 异步执行。

建议规则：

- 网络异常自动重试。
- 第三方返回临时错误自动重试。
- 第三方返回业务拒绝时记录失败原因。
- 超过最大重试次数后，发送状态置为 `FAIL`。
- 支持后台人工补发。

小程序任务默认最多重试 3 次，使用退避策略。通过统一发送接口触发小程序通知时，发送日志先记录为 `PENDING`，由异步任务负责实际推送。

## 发送日志

发送结果写入 `notification_send_log`。

建议日志字段包括：

- `message_id`
- `event_code`
- `event_name`
- `biz_no`
- `ticket_id`
- `template_id`
- `channel_type`
- `receiver`
- `receiver_type`
- `summary`
- `event_time`
- `sent_at`
- `send_status`
- `retry_count`
- `fail_reason`
- `request_payload`
- `response_payload`

实现时应以 `infra/sql/init.sql` 和 `apps/core_api/notifications/models.py` 中的表结构为准。

## 鉴权

面向内部服务的接口必须做鉴权。

推荐方式：

- `core_api` 调用通知服务时使用 JWT 或服务间签名。
- 小程序推送接口也应校验内部服务身份。
- 外部小程序 Webhook 使用 `timestamp + nonce + sign` 防重放和防篡改。

`/api/v1/notifications/send` 和 `/api/v1/miniapp/push` 均需要 token 校验。服务间调用可以使用带 `service_name` 的内部 token，后台用户调用可以使用带 `user_id` 的用户 token。

## 本地运行

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

启动 Celery Worker：

```bash
celery -A app.core.celery_app worker --loglevel=info
```

## 环境变量

主要配置项：

| 变量 | 说明 |
| --- | --- |
| `DATABASE_URL` | MySQL 连接地址 |
| `JWT_SECRET_KEY` | 与 `core_api` 共享的 JWT 密钥 |
| `JWT_ALGORITHM` | JWT 算法 |
| `CELERY_BROKER_URL` | Celery Broker 地址 |
| `CELERY_RESULT_BACKEND` | Celery 结果后端 |
| `MINIAPP_NOTIFY_URL` | 小程序统一通知地址 |
| `MINIAPP_NOTIFY_SECRET` | 小程序通知签名密钥 |

## 项目结构

```text
notification_service/
  requirements.txt
  README.md
  app/
    main.py
    api/
      health.py
      miniapp.py
      notification.py
    core/
      celery_app.py
      config.py
      database.py
      security.py
    schemas/
      miniapp.py
      notification.py
    tasks/
      miniapp.py
```
