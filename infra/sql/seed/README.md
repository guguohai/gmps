# 配置种子数据导入

当前项目推荐以 `infra/seed` 中的 YAML 作为配置种子数据源，通过 Django management command 导入数据库。

本目录保留 `00_seed_all.sql` 和 `01_seed_*.sql` 包装入口，主要用于兼容 MySQL CLI 直接执行。包装文件通过 `SOURCE ../init-sql/*.sql` 复用旧 SQL，避免维护两份重复 SQL。

## 使用方式

在项目根目录执行：

```bash
python apps/core_api/manage.py seed_config --mode validate
python apps/core_api/manage.py seed_config --mode upsert
python apps/core_api/manage.py seed_config --mode replace --yes
```

默认会优先读取：

```text
infra/seed/
  roles.yaml
  workflow.ticket.yaml
  notification_templates.yaml
```

如需强制使用旧 SQL：

```bash
python apps/core_api/manage.py seed_config --mode upsert --format sql
```

也可以使用 MySQL CLI：

```sql
SOURCE infra/sql/seed/00_seed_all.sql;
```

注意：MySQL CLI 方式直接执行原始 SQL，不会自动追加 `ON DUPLICATE KEY UPDATE`。需要可重复导入和更新时，优先使用 `seed_config --mode upsert`。

## 模式说明

| 模式 | 说明 |
| --- | --- |
| `validate` | 只检查 SQL 文件是否存在、语句格式是否可识别，不写数据库 |
| `upsert` | 推荐日常使用，存在则更新，不存在则插入 |
| `replace` | 清空配置表后重新导入，仅建议本地和测试环境使用 |

## 数据来源

旧 SQL 兼容入口执行顺序：

```text
01_init_sys_role.sql
02_init_sys_permission.sql
03_init_sys_role_permission.sql
04_init_wf_status.sql
05_init_wf_action.sql
06_init_wf_transition.sql
07_init_wf_action_permission.sql
08_init_wf_auto_rule.sql
09_init_sys_dict_item.sql
10_init_notification_template.sql
```

## 设计约定

- 使用业务编码和唯一键做配置数据识别。
- `upsert` 模式会自动为 `INSERT` 语句追加 `ON DUPLICATE KEY UPDATE`。
- `replace` 模式会先删除角色、权限、状态机、字典和通知模板等配置表数据，再重新导入。
- `_pending` 目录中的占位 SQL 不参与导入。

## 后续建议

后续新增或修改基础配置时，优先修改 `infra/seed` 下的 YAML。`infra/sql/init-sql` 仅作为兼容旧导入方式的 SQL 版本。
