SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

SOURCE 01_seed_sys_role.sql;
SOURCE 02_seed_sys_permission.sql;
SOURCE 03_seed_sys_role_permission.sql;
SOURCE 04_seed_wf_status.sql;
SOURCE 05_seed_wf_action.sql;
SOURCE 06_seed_wf_transition.sql;
SOURCE 07_seed_wf_action_permission.sql;
SOURCE 08_seed_wf_auto_rule.sql;
SOURCE 09_seed_sys_dict_item.sql;
SOURCE 10_seed_notification_template.sql;

SET FOREIGN_KEY_CHECKS = 1;

