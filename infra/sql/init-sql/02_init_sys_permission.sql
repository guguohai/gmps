INSERT INTO sys_permission (
  permission_code, permission_name, permission_type, parent_id,
  permission_path, component_path, sort_no, is_visible, status,
  permission_desc, created_at, updated_at
) VALUES
('MENU_TICKET', '工单管理', 'MENU', NULL, '/ticket', '/ticket/index', 10, 1, 'ENABLED', '工单管理菜单', NOW(), NOW()),
('MENU_INVENTORY', '库存管理', 'MENU', NULL, '/inventory', '/inventory/index', 20, 1, 'ENABLED', '库存管理菜单', NOW(), NOW()),
('MENU_SURVEY', '问卷管理', 'MENU', NULL, '/survey', '/survey/index', 30, 1, 'ENABLED', '问卷管理菜单', NOW(), NOW()),
('MENU_SETTING', '系统配置', 'MENU', NULL, '/setting', '/setting/index', 40, 1, 'ENABLED', '系统配置菜单', NOW(), NOW()),
('MENU_CONSULTATION', '咨询管理', 'MENU', NULL, '/consultation', '/consultation/index', 35, 1, 'ENABLED', '咨询管理菜单', NOW(), NOW()),
('MENU_INVENTORY_REQUEST', '库存申请管理', 'MENU', NULL, '/inventory/request', '/inventory/request/index', 10, 1, 'ENABLED', '库存申请菜单', NOW(), NOW()),
('MENU_PART_REQUEST', '小零件申请管理', 'MENU', NULL, '/inventory/part-request', '/inventory/part-request/index', 20, 1, 'ENABLED', '小零件申请菜单', NOW(), NOW()),
('MENU_PRODUCT', '产品管理', 'MENU', NULL, '/product', '/product/index', 25, 1, 'ENABLED', '产品管理菜单', NOW(), NOW()),
('MENU_PART', '小零件管理', 'MENU', NULL, '/part', '/part/index', 26, 1, 'ENABLED', '小零件管理菜单', NOW(), NOW()),
('MENU_USER_PERMISSION', '用户权限', 'MENU', NULL, '/setting/user-permission', '/setting/user-permission/index', 50, 1, 'ENABLED', '用户/角色/权限菜单', NOW(), NOW()),

('BTN_TICKET_APPROVE', '工单审核通过', 'BUTTON', NULL, NULL, NULL, 10, 1, 'ENABLED', '审核通过按钮权限', NOW(), NOW()),
('BTN_TICKET_REJECT', '工单审核驳回', 'BUTTON', NULL, NULL, NULL, 20, 1, 'ENABLED', '审核驳回按钮权限', NOW(), NOW()),
('BTN_TICKET_RECEIVE', '确认接收', 'BUTTON', NULL, NULL, NULL, 30, 1, 'ENABLED', '确认接收按钮权限', NOW(), NOW()),
('BTN_TICKET_JUDGE_FREE', '提交无偿判定', 'BUTTON', NULL, NULL, NULL, 40, 1, 'ENABLED', '提交无偿判定按钮权限', NOW(), NOW()),
('BTN_TICKET_JUDGE_PAID', '提交有偿判定', 'BUTTON', NULL, NULL, NULL, 50, 1, 'ENABLED', '提交有偿判定按钮权限', NOW(), NOW()),
('BTN_TICKET_CREATE_PAYMENT', '生成支付单', 'BUTTON', NULL, NULL, NULL, 60, 1, 'ENABLED', '生成支付单按钮权限', NOW(), NOW()),
('BTN_TICKET_START_REPAIR', '开始处理', 'BUTTON', NULL, NULL, NULL, 70, 1, 'ENABLED', '开始处理按钮权限', NOW(), NOW()),
('BTN_TICKET_MARK_WAIT_PARTS', '标记等待配件', 'BUTTON', NULL, NULL, NULL, 80, 1, 'ENABLED', '等待配件按钮权限', NOW(), NOW()),
('BTN_TICKET_SUBMIT_REPAIR_DONE', '提交处理完成', 'BUTTON', NULL, NULL, NULL, 90, 1, 'ENABLED', '提交处理完成按钮权限', NOW(), NOW()),
('BTN_TICKET_SUBMIT_OUTBOUND', '提交出库', 'BUTTON', NULL, NULL, NULL, 100, 1, 'ENABLED', '提交出库按钮权限', NOW(), NOW()),
('BTN_TICKET_CONFIRM_STORE_RECEIVE', '确认门店收货', 'BUTTON', NULL, NULL, NULL, 110, 1, 'ENABLED', '确认门店收货按钮权限', NOW(), NOW()),
('BTN_TICKET_CONFIRM_CUSTOMER_PICKUP', '确认客户取件', 'BUTTON', NULL, NULL, NULL, 120, 1, 'ENABLED', '确认客户取件按钮权限', NOW(), NOW()),

('BTN_DICT_MAINTAIN', '维护字典', 'BUTTON', NULL, NULL, NULL, 10, 1, 'ENABLED', '字典维护权限', NOW(), NOW()),
('BTN_NOTIFICATION_TEMPLATE_MAINTAIN', '维护通知模板', 'BUTTON', NULL, NULL, NULL, 20, 1, 'ENABLED', '通知模板维护权限', NOW(), NOW()),
('BTN_ROLE_MAINTAIN', '维护角色', 'BUTTON', NULL, NULL, NULL, 30, 1, 'ENABLED', '角色维护权限', NOW(), NOW()),
('BTN_PERMISSION_MAINTAIN', '维护权限', 'BUTTON', NULL, NULL, NULL, 40, 1, 'ENABLED', '权限维护权限', NOW(), NOW());


-- 回填权限父级关系：主键 id 由数据库自增长生成，通过 permission_code 定位。
UPDATE sys_permission child
JOIN sys_permission parent ON parent.permission_code = 'MENU_INVENTORY'
SET child.parent_id = parent.id
WHERE child.permission_code IN ('MENU_INVENTORY_REQUEST', 'MENU_PART_REQUEST');

UPDATE sys_permission child
JOIN sys_permission parent ON parent.permission_code = 'MENU_SETTING'
SET child.parent_id = parent.id
WHERE child.permission_code IN ('MENU_USER_PERMISSION', 'BTN_DICT_MAINTAIN', 'BTN_NOTIFICATION_TEMPLATE_MAINTAIN');

UPDATE sys_permission child
JOIN sys_permission parent ON parent.permission_code = 'MENU_TICKET'
SET child.parent_id = parent.id
WHERE child.permission_code IN ('BTN_TICKET_APPROVE', 'BTN_TICKET_REJECT', 'BTN_TICKET_RECEIVE', 'BTN_TICKET_JUDGE_FREE', 'BTN_TICKET_JUDGE_PAID', 'BTN_TICKET_CREATE_PAYMENT', 'BTN_TICKET_START_REPAIR', 'BTN_TICKET_MARK_WAIT_PARTS', 'BTN_TICKET_SUBMIT_REPAIR_DONE', 'BTN_TICKET_SUBMIT_OUTBOUND', 'BTN_TICKET_CONFIRM_STORE_RECEIVE', 'BTN_TICKET_CONFIRM_CUSTOMER_PICKUP');

UPDATE sys_permission child
JOIN sys_permission parent ON parent.permission_code = 'MENU_USER_PERMISSION'
SET child.parent_id = parent.id
WHERE child.permission_code IN ('BTN_ROLE_MAINTAIN', 'BTN_PERMISSION_MAINTAIN');
