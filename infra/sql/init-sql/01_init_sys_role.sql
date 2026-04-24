INSERT INTO sys_role (
  role_code, role_name, role_type, role_desc, status, created_at, updated_at
) VALUES
('CS_MANAGER', '客服主管', 'BUSINESS_ROLE', '负责申请审核、工单关闭等操作', 'ENABLED', NOW(), NOW()),
('RECEIVE_OPERATOR', '接收专员', 'BUSINESS_ROLE', '负责确认接收产品', 'ENABLED', NOW(), NOW()),
('JUDGE_OPERATOR', '判定专员', 'BUSINESS_ROLE', '负责提交判定、发起客户确认、生成支付单', 'ENABLED', NOW(), NOW()),
('SERVICE_ENGINEER', '服务工程师', 'BUSINESS_ROLE', '负责开始处理、提交处理完成', 'ENABLED', NOW(), NOW()),
('FULFILLMENT_OPERATOR', '履约专员', 'BUSINESS_ROLE', '负责出库准备、提交出库', 'ENABLED', NOW(), NOW()),
('STORE_OPERATOR', '门店操作员', 'BUSINESS_ROLE', '负责门店收货、客户取件确认', 'ENABLED', NOW(), NOW()),
('SYSTEM_ADMIN', '系统管理员', 'SYSTEM_ROLE', '负责用户、角色、权限、配置维护', 'ENABLED', NOW(), NOW());
