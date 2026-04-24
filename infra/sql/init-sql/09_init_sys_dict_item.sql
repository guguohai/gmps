INSERT INTO sys_dict_item (
  dict_type, item_code, item_name, item_name_en, item_name_ko,
  parent_code, sort_no, is_default, status, ext_value1, ext_value2,
  remark, created_by, created_at
) VALUES
('PAYMENT_METHOD', 'WECHAT_PAY', '微信支付', 'WeChat Pay', '위챗페이', NULL, 10, 1, 'ENABLED', NULL, NULL, '小程序支付方式', NULL, NOW()),
('PAYMENT_METHOD', 'OFFLINE_PAY', '线下支付', 'Offline Payment', '오프라인 결제', NULL, 20, 0, 'ENABLED', NULL, NULL, '预留', NULL, NOW()),
('DELIVERY_METHOD', 'EXPRESS', '快递', 'Express', '택배', NULL, 10, 1, 'ENABLED', NULL, NULL, '快递返还', NULL, NOW()),
('DELIVERY_METHOD', 'STORE_PICKUP', '门店取件', 'Store Pickup', '매장 픽업', NULL, 20, 0, 'ENABLED', NULL, NULL, '门店取件', NULL, NOW()),
('DELIVERY_METHOD', 'THREE_PL', '3PL发货', '3PL Delivery', '3PL 배송', NULL, 30, 0, 'ENABLED', NULL, NULL, '3PL发货', NULL, NOW()),
('INVENTORY_ITEM_TYPE', 'PRODUCT', '产品', 'Product', '제품', NULL, 10, 1, 'ENABLED', NULL, NULL, '产品库存对象', NULL, NOW()),
('INVENTORY_ITEM_TYPE', 'PART', '小零件', 'Part', '부품', NULL, 20, 0, 'ENABLED', NULL, NULL, '小零件库存对象', NULL, NOW()),
('INVENTORY_RECORD_TYPE', 'INBOUND', '入库', 'Inbound', '입고', NULL, 10, 0, 'ENABLED', NULL, NULL, '入库流水', NULL, NOW()),
('INVENTORY_RECORD_TYPE', 'OUTBOUND', '出库', 'Outbound', '출고', NULL, 20, 0, 'ENABLED', NULL, NULL, '出库流水', NULL, NOW()),
('INVENTORY_RECORD_TYPE', 'FREEZE', '冻结', 'Freeze', '동결', NULL, 30, 0, 'ENABLED', NULL, NULL, '冻结流水', NULL, NOW()),
('INVENTORY_RECORD_TYPE', 'RELEASE', '释放', 'Release', '해제', NULL, 40, 0, 'ENABLED', NULL, NULL, '释放流水', NULL, NOW()),
('INVENTORY_RECORD_TYPE', 'ADJUST', '调整', 'Adjust', '조정', NULL, 50, 0, 'ENABLED', NULL, NULL, '库存调整', NULL, NOW()),
('INVENTORY_RECORD_TYPE', 'DIFF_FIX', '差异修正', 'Difference Fix', '차이 수정', NULL, 80, 1, 'ENABLED', NULL, NULL, '差异修正流水', NULL, NOW());
