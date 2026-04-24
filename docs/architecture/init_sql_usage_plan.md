# 初始化 SQL 使用方案

## 结论

`infra/sql/init-sql` 中的初始化数据可以用于第一阶段开发，而且应该作为状态机配置、权限配置、字典配置和通知模板配置的基础来源。

但这些 SQL 不能不加校验地直接视为最终业务规格。当前 SQL 中已经包含一批可用配置，也存在一些需要补齐和治理的缺口。建议把它作为“配置种子数据”，由文档规格和自动化校验共同约束。

## 可直接使用的数据

### 角色

文件：`01_init_sys_role.sql`

可用于工单动作权限：

- `CS_MANAGER`
- `RECEIVE_OPERATOR`
- `JUDGE_OPERATOR`
- `SERVICE_ENGINEER`
- `FULFILLMENT_OPERATOR`
- `STORE_OPERATOR`
- `SYSTEM_ADMIN`

这些角色已经能覆盖申请审核、接收、判定、维修处理、履约、门店收货和系统配置。

### 权限

文件：`02_init_sys_permission.sql`

可用于后台菜单和按钮权限：

- 工单管理菜单。
- 工单审核、驳回、接收、判定、生成支付单、开始处理、等待配件、处理完成、出库、门店收货、客户取件等按钮权限。

注意：按钮权限和 `wf_action_permission` 是两层权限。按钮权限控制前端是否展示入口，`wf_action_permission` 控制状态机是否允许执行动作。后端必须以后者为准。

### 角色权限

文件：`03_init_sys_role_permission.sql`

可用于后台权限初始化。

后续需要检查按钮权限是否完整覆盖所有人工动作，例如：

- `PARTS_ARRIVED`
- `PREPARE_OUTBOUND`
- `MARK_STORE_READY_PICKUP`
- `CANCEL_TICKET`

如果前端需要展示这些动作按钮，应补齐对应按钮权限。

### 状态机状态

文件：`04_init_wf_status.sql`

可作为工单状态机第一阶段状态配置来源。

其中 `TICKET` 已包含：

- 主状态。
- 客户展示状态。
- 工单业务状态。

注意：部分状态已经定义但暂未接入流转，例如：

- `WAIT_JUDGE`
- `JUDGED_COMPLETED`
- `WAIT_REPAIR`
- `REFUND_PROCESSING`
- `REFUND_COMPLETED`

这些状态可以保留为预留配置，但第一阶段不要在接口和前端作为可执行状态暴露。

### 状态机动作

文件：`05_init_wf_action.sql`

可作为动作配置来源。

其中 `TICKET` 已覆盖：

- 申请审核。
- 产品接收。
- 有偿/无偿判定。
- 生成支付单。
- 支付成功回写。
- 支付逾期和关闭。
- 开始维修。
- 等待配件。
- 处理完成。
- 出库。
- 物流同步。
- 门店收货和客户取件。
- 自动完成。
- 取消工单。

需要补齐或确认的动作：

- `PAY_FAILED`
- `PAY_CLOSED`
- `APPLY_REFUND`
- `REFUND_SUCCESS`
- `REFUND_FAILED`
- `MARK_PAYMENT_EXCEPTION`

这些与支付服务独立后更相关，建议第二阶段补。

### 状态流转

文件：`06_init_wf_transition.sql`

可作为第一阶段状态机执行配置来源。

已覆盖：

- 申请审核通过/驳回。
- 接收。
- 判定无偿/有偿。
- 支付成功、逾期、超时关闭。
- 开始维修、自动开始维修。
- 等待配件和配件到齐。
- 维修完成。
- 出库。
- 物流配送和签收。
- 门店收货、可取、客户取件。
- 自动完成。
- 部分取消。

必须补齐或确认的流转：

- 门店自提路径缺少 `DELIVERING -> STORE_ARRIVED`。
- 支付失败和支付关闭事件没有流转策略。
- 退款状态已定义但没有流转。
- 取消工单只覆盖 `WAIT_RECEIVE` 和 `RECEIVED`。
- `WAIT_JUDGE`、`WAIT_REPAIR` 等预留状态没有接入。

### 动作权限

文件：`07_init_wf_action_permission.sql`

可作为状态机动作权限来源。

后端执行人工动作时，应查询 `wf_action_permission`，不要只依赖前端按钮权限。

需要注意：

- 系统动作一般不需要普通角色权限，但需要服务间鉴权和 `is_system_only` 校验。
- 当前权限表未覆盖 `WAIT_RECEIVE -> CANCEL_TICKET`，但流转表中存在该流转。需要补齐或确认是否允许客服主管在接收前取消。
- 当前权限表未覆盖 `PARTS_ARRIVED`、`PREPARE_OUTBOUND`、`MARK_STORE_READY_PICKUP` 对应按钮权限的一致性检查。

### 自动规则

文件：`08_init_wf_auto_rule.sql`

可供 `scheduler_worker` 使用。

已覆盖：

- 无偿判定后 D+3 工作日自动开始处理。
- 支付完成后 D+3 工作日自动开始处理。
- 待支付 D+29 自然日标记支付逾期。
- 支付逾期 D+1 自然日关闭。
- 签收或取件 D+1 工作日自动完成。
- 问卷到期自动过期。

开发时需要约定：

- `+D3`、`+D29`、`deadline_at` 的解析规则。
- 工作日和节假日来源。
- 自动任务幂等键，例如 `rule_code + biz_type + biz_id + due_time`。

### 字典

文件：`09_init_sys_dict_item.sql`

可用于工单字段选项：

- `PAYMENT_METHOD`
- `DELIVERY_METHOD`
- `INVENTORY_ITEM_TYPE`
- `INVENTORY_RECORD_TYPE`

其中 `DELIVERY_METHOD` 对状态流转很重要：

- `EXPRESS`
- `STORE_PICKUP`
- `THREE_PL`

建议在 `SYNC_LOGISTICS` 流转中使用 `delivery_method` 或物流事件类型作为条件，区分直邮签收和门店自提到店。

### 通知模板

文件：`10_init_notification_template.sql`

可用于通知服务第一阶段模板：

- 支付成功通知。
- 发货通知。
- 服务完成通知。
- 问卷提醒通知。
- 客户确认事项通知。

建议补齐：

- 待支付通知。
- 支付逾期提醒。
- 门店到货/可取通知。
- 取消/关闭通知。
- 退款成功/失败通知。
- 维修等待配件通知。

## 暂不能直接使用的数据

`_pending` 目录中的文件是占位：

- `11_init_sys_user.todo.sql`
- `12_init_sys_user_role.todo.sql`
- `13_init_warehouse_location.todo.sql`
- `14_init_survey_template.todo.sql`

这些不能作为正式初始化数据使用。它们缺少真实用户、用户角色、仓库库位和问卷模板，需要后续按实际业务补齐。

## 已落地的导入方式

当前已新增 Django management command：

```bash
python apps/core_api/manage.py seed_config --mode validate
python apps/core_api/manage.py seed_config --mode upsert
python apps/core_api/manage.py seed_config --mode replace --yes
```

默认优先读取 `infra/seed` 下的 YAML：

```text
infra/seed/roles.yaml
infra/seed/workflow.ticket.yaml
infra/seed/notification_templates.yaml
```

如需兼容旧 SQL，可显式指定：

```bash
python apps/core_api/manage.py seed_config --mode upsert --format sql
```

详细说明见：

```text
infra/sql/seed/README.md
```

`upsert` 模式会在运行时把 YAML 转换为 SQL 并追加 `ON DUPLICATE KEY UPDATE`，方便反复导入和修改。`replace` 模式会先清空配置表，再重新导入，仅建议本地和测试环境使用。

## 建议补充的校验

为了让初始化 SQL 能稳定支撑开发，建议增加一个配置一致性检查脚本或管理命令。

检查项：

- 每个 `wf_transition.from_status_code` 和 `to_status_code` 都存在于 `wf_status`。
- 每个 `wf_transition.action_code` 都存在于 `wf_action`。
- 每个人工流转都有对应 `wf_action_permission`。
- 每个 `wf_action_permission.status_code` 都存在于 `wf_status`。
- 每个 `wf_action_permission.action_code` 都存在于 `wf_action`。
- 每个 `wf_auto_rule.from_status_code` 都存在于 `wf_status`。
- 每个 `wf_auto_rule.action_code` 都存在于 `wf_action`。
- 每个人工动作如果要在前端展示，应有对应按钮权限。
- `is_system_only=1` 的流转不能出现在普通用户可用动作里。
- 终态不能有普通人工流转。
- 客户展示状态和主状态映射不能为空。

## 建议补充的文档

目前建议再补三类内容：

1. 工单状态机配置治理规范：说明新增状态、动作、流转、权限、通知模板时需要同步改哪些表。
2. 服务间事件规范：统一支付、物流、SAP、通知、定时任务回写 `core_api` 的事件格式和幂等规则。
3. 初始化 SQL 校验清单：把上面的校验项变成可执行脚本或 Django management command。

## 开发使用方式

第一阶段建议这样使用初始化 SQL：

1. 用 `00_run_all.sql` 初始化基础配置。
2. 以 `04` 到 `08` 作为状态机核心配置。
3. 后端 `WorkflowEngineService` 完全读取数据库配置，不硬编码状态流转。
4. 前端可用动作来自 `TicketAvailableAction` 或实时查询，不直接硬编码按钮。
5. `scheduler_worker` 读取 `wf_auto_rule`，到期后调用 `core_api` 内部动作接口。
6. `notification_service` 读取 `notification_template` 或由 `core_api` 传入模板码触发通知。

## 需要先处理的问题

在正式作为种子数据前，建议先做以下处理：

- 确认 SQL 文件编码为 UTF-8。
- 在本地 MySQL 执行一次 `00_run_all.sql`，确认没有语法错误。
- 对照 `ticket_workflow_spec.md` 补齐第一阶段必须流转。
- 对照人工动作补齐按钮权限和动作权限。
- 明确 `_pending` 文件不参与正式初始化。
