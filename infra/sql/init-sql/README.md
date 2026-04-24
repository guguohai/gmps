# GM 售后管理系统初始化 SQL 包

本包按《GM数据库设计文档0423.md》附录 B.2「核心表初始化 SQL 清单」整理。

## 内容

| 文件 | 说明 |
|---|---|
| `00_run_all.sql` | 推荐执行入口 |
| `01_init_sys_role.sql` | 角色初始化 |
| `02_init_sys_permission.sql` | 权限初始化 |
| `03_init_sys_role_permission.sql` | 角色权限初始化 |
| `04_init_wf_status.sql` | 状态初始化 |
| `05_init_wf_action.sql` | 动作初始化 |
| `06_init_wf_transition.sql` | 状态流转初始化 |
| `07_init_wf_action_permission.sql` | 动作权限初始化 |
| `08_init_wf_auto_rule.sql` | 自动规则初始化 |
| `09_init_sys_dict_item.sql` | 字典初始化 |
| `10_init_notification_template.sql` | 通知模板初始化 |
| `_pending/` | 文档明确标注“建议后续补充”的初始化占位文件 |

## 说明

- 本包只整理文档中已明确给出的初始化数据及可直接支撑的配置。
- `sys_user`、`sys_user_role`、`warehouse`、`warehouse_location`、`survey_template` 属于后续补充项，已放入 `_pending`，未伪造正式数据。
- 本包所有正式初始化 SQL 均不写入主键 `id`，默认由 MySQL 自增长生成。
- 涉及外键关联的初始化数据，通过 `role_code`、`permission_code` 等业务编码回查自增长主键。

## 主键说明

- `id` 字段统一交由 MySQL `AUTO_INCREMENT` 生成。
- 初始化数据只维护业务编码、名称、状态、规则等业务字段。
- 权限父级关系通过 `permission_code` 回填 `parent_id`。
- 角色权限关系通过 `role_code` 与 `permission_code` 查询对应自增长主键。
