INSERT INTO notification_template (
  template_code, template_type, template_name, template_title,
  template_content, business_scene, trigger_node, lang_code,
  variable_desc, is_default, status, remark, created_at, updated_at
) VALUES
('TICKET_PAYMENT_SUCCESS_MINI_PROGRAM', 'MINI_PROGRAM', '支付成功通知', '支付成功通知',
'您的售后工单已支付成功，工单编号：${ticket_no}。', 'TICKET', 'PAY_SUCCESS', 'zh_CN',
'变量：ticket_no', 1, 'ENABLED', '支付成功后发送', NOW(), NOW()),
('TICKET_OUTBOUND_MINI_PROGRAM', 'MINI_PROGRAM', '发货通知', '发货通知',
'您的售后工单已发出，工单编号：${ticket_no}，运单号：${tracking_no}。', 'TICKET', 'SUBMIT_OUTBOUND', 'zh_CN',
'变量：ticket_no,tracking_no', 1, 'ENABLED', '提交出库后发送', NOW(), NOW()),
('TICKET_COMPLETED_MINI_PROGRAM', 'MINI_PROGRAM', '服务完成通知', '服务完成通知',
'您的售后工单已完成，工单编号：${ticket_no}。感谢您的耐心等待。', 'TICKET', 'AUTO_COMPLETE', 'zh_CN',
'变量：ticket_no', 1, 'ENABLED', '服务完成后发送', NOW(), NOW()),
('SURVEY_REMIND_MINI_PROGRAM', 'MINI_PROGRAM', '问卷提醒通知', '问卷提醒通知',
'您的售后服务已完成，欢迎填写满意度问卷。问卷编号：${survey_no}。', 'SURVEY', 'SURVEY_CREATE', 'zh_CN',
'变量：survey_no', 1, 'ENABLED', '问卷创建后发送', NOW(), NOW()),
('TICKET_CUSTOMER_CONFIRM_MINI_PROGRAM', 'MINI_PROGRAM', '客户确认事项通知', '客户确认事项通知',
'您的售后工单有待确认事项，请尽快查看并处理。工单编号：${ticket_no}。', 'CONSULTATION', 'WAIT_CONFIRM', 'zh_CN',
'变量：ticket_no', 1, 'ENABLED', '事项进入待客户确认后发送', NOW(), NOW());
