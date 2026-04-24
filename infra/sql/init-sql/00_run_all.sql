SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

SOURCE 01_init_sys_role.sql;
SOURCE 02_init_sys_permission.sql;
SOURCE 03_init_sys_role_permission.sql;
SOURCE 04_init_wf_status.sql;
SOURCE 05_init_wf_action.sql;
SOURCE 06_init_wf_transition.sql;
SOURCE 07_init_wf_action_permission.sql;
SOURCE 08_init_wf_auto_rule.sql;
SOURCE 09_init_sys_dict_item.sql;
SOURCE 10_init_notification_template.sql;

SET FOREIGN_KEY_CHECKS = 1;
