SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE DATABASE IF NOT EXISTS ps_admin
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_0900_ai_ci;

USE ps_admin;

DROP TABLE IF EXISTS external_interface_config;
DROP TABLE IF EXISTS sys_dict_item;
DROP TABLE IF EXISTS notification_send_log;
DROP TABLE IF EXISTS notification_template;
DROP TABLE IF EXISTS survey_answer;
DROP TABLE IF EXISTS survey_task;
DROP TABLE IF EXISTS survey_template_option;
DROP TABLE IF EXISTS survey_template_question;
DROP TABLE IF EXISTS survey_template;
DROP TABLE IF EXISTS inventory_sync_log;
DROP TABLE IF EXISTS inventory_diff;
DROP TABLE IF EXISTS part_request;
DROP TABLE IF EXISTS inventory_request;
DROP TABLE IF EXISTS inventory_txn;
DROP TABLE IF EXISTS inventory_balance;
DROP TABLE IF EXISTS ticket_available_action;
DROP TABLE IF EXISTS ticket_exception;
DROP TABLE IF EXISTS ticket_action_log;
DROP TABLE IF EXISTS ticket_status_log;
DROP TABLE IF EXISTS ticket_progress;
DROP TABLE IF EXISTS ticket_attachment;
DROP TABLE IF EXISTS ticket_consultation_attachment;
DROP TABLE IF EXISTS ticket_cancel_log;
DROP TABLE IF EXISTS ticket_consultation;
DROP TABLE IF EXISTS ticket_inbound_logistics;
DROP TABLE IF EXISTS ticket_fulfillment;
DROP TABLE IF EXISTS ticket_refund;
DROP TABLE IF EXISTS ticket_payment_event_log;
DROP TABLE IF EXISTS ticket_payment;
DROP TABLE IF EXISTS ticket_repair;
DROP TABLE IF EXISTS ticket_snapshot;
DROP TABLE IF EXISTS ticket;
DROP TABLE IF EXISTS wf_auto_rule;
DROP TABLE IF EXISTS wf_action_permission;
DROP TABLE IF EXISTS wf_transition;
DROP TABLE IF EXISTS wf_action;
DROP TABLE IF EXISTS wf_status;
DROP TABLE IF EXISTS sys_role_permission;
DROP TABLE IF EXISTS sys_user_role;
DROP TABLE IF EXISTS warehouse_location;
DROP TABLE IF EXISTS part_config;
DROP TABLE IF EXISTS sys_permission;
DROP TABLE IF EXISTS sys_role;
DROP TABLE IF EXISTS sys_user;
DROP TABLE IF EXISTS warehouse;
DROP TABLE IF EXISTS part;
DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS store;
DROP TABLE IF EXISTS customer;

CREATE TABLE customer (
  id BIGINT NOT NULL AUTO_INCREMENT,
  customer_phone VARCHAR(32) NOT NULL,
  customer_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NULL,
  country_code VARCHAR(50) NULL,
  default_address VARCHAR(255) NULL,
  marketing_agree TINYINT NOT NULL DEFAULT 0,
  privacy_agree TINYINT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_customer_phone (customer_phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE store (
  id BIGINT NOT NULL AUTO_INCREMENT,
  store_code VARCHAR(64) NOT NULL,
  store_name VARCHAR(100) NOT NULL,
  store_type VARCHAR(64) NULL,
  store_address VARCHAR(255) NULL,
  latitude DECIMAL(10,6) NULL,
  longitude DECIMAL(10,6) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_store_code (store_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE product (
  id BIGINT NOT NULL AUTO_INCREMENT,
  product_code VARCHAR(64) NOT NULL,
  product_name VARCHAR(200) NOT NULL,
  product_category VARCHAR(64) NULL,
  market_date DATE NULL,
  part_keep_until DATE NULL,
  stock_location VARCHAR(100) NULL,
  part_stock_location VARCHAR(100) NULL,
  safe_stock_threshold INT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_product_code (product_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE part (
  id BIGINT NOT NULL AUTO_INCREMENT,
  part_code VARCHAR(64) NOT NULL,
  part_name VARCHAR(200) NOT NULL,
  color VARCHAR(50) NULL,
  specification VARCHAR(100) NULL,
  stock_location VARCHAR(100) NULL,
  default_qty INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_part_code (part_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE warehouse (
  id BIGINT NOT NULL AUTO_INCREMENT,
  warehouse_code VARCHAR(64) NOT NULL,
  warehouse_name VARCHAR(100) NOT NULL,
  warehouse_type VARCHAR(64) NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'ENABLED',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_warehouse_code (warehouse_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE sys_user (
  id BIGINT NOT NULL AUTO_INCREMENT,
  user_no VARCHAR(64) NOT NULL,
  username VARCHAR(100) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  job_title VARCHAR(100) NULL,
  department VARCHAR(100) NULL,
  phone VARCHAR(100) NULL,
  email VARCHAR(100) NULL,
  country_code VARCHAR(50) NULL,
  office_address VARCHAR(255) NULL,
  effective_date DATE NULL,
  expire_date DATE NULL,
  ip_match_mode VARCHAR(10) NULL,
  allowed_ip VARCHAR(255) NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'ENABLED',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_sys_user_user_no (user_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE sys_role (
  id BIGINT NOT NULL AUTO_INCREMENT,
  role_code VARCHAR(64) NOT NULL,
  role_name VARCHAR(100) NOT NULL,
  role_type VARCHAR(64) NULL,
  role_desc TEXT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'ENABLED',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_sys_role_role_code (role_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE sys_permission (
  id BIGINT NOT NULL AUTO_INCREMENT,
  permission_code VARCHAR(64) NOT NULL,
  permission_name VARCHAR(100) NOT NULL,
  permission_type VARCHAR(32) NOT NULL,
  parent_id BIGINT NULL,
  permission_path VARCHAR(255) NULL,
  component_path VARCHAR(255) NULL,
  sort_no INT NOT NULL DEFAULT 0,
  is_visible TINYINT NOT NULL DEFAULT 1,
  status VARCHAR(32) NOT NULL DEFAULT 'ENABLED',
  permission_desc TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_sys_permission_permission_code (permission_code),
  KEY idx_sys_permission_parent_id (parent_id),
  CONSTRAINT fk_sys_permission_parent_id FOREIGN KEY (parent_id) REFERENCES sys_permission(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE part_config (
  id BIGINT NOT NULL AUTO_INCREMENT,
  part_id BIGINT NOT NULL,
  qty_type VARCHAR(64) NOT NULL,
  qty_name VARCHAR(100) NOT NULL,
  default_qty INT NOT NULL DEFAULT 0,
  sort_no INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_part_config_part_id (part_id),
  CONSTRAINT fk_part_config_part_id FOREIGN KEY (part_id) REFERENCES part(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE warehouse_location (
  id BIGINT NOT NULL AUTO_INCREMENT,
  warehouse_id BIGINT NOT NULL,
  location_code VARCHAR(64) NOT NULL,
  location_name VARCHAR(100) NOT NULL,
  location_type VARCHAR(32) NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'ENABLED',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_warehouse_location_warehouse_code (warehouse_id, location_code),
  KEY idx_warehouse_location_warehouse_id (warehouse_id),
  CONSTRAINT fk_warehouse_location_warehouse_id FOREIGN KEY (warehouse_id) REFERENCES warehouse(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE sys_user_role (
  id BIGINT NOT NULL AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  role_id BIGINT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_sys_user_role_user_role (user_id, role_id),
  KEY idx_sys_user_role_role_id (role_id),
  CONSTRAINT fk_sys_user_role_user_id FOREIGN KEY (user_id) REFERENCES sys_user(id),
  CONSTRAINT fk_sys_user_role_role_id FOREIGN KEY (role_id) REFERENCES sys_role(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE sys_role_permission (
  id BIGINT NOT NULL AUTO_INCREMENT,
  role_id BIGINT NOT NULL,
  permission_id BIGINT NOT NULL,
  is_granted TINYINT NOT NULL DEFAULT 1,
  remark TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_sys_role_permission_role_permission (role_id, permission_id),
  KEY idx_sys_role_permission_permission_id (permission_id),
  CONSTRAINT fk_sys_role_permission_role_id FOREIGN KEY (role_id) REFERENCES sys_role(id),
  CONSTRAINT fk_sys_role_permission_permission_id FOREIGN KEY (permission_id) REFERENCES sys_permission(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE wf_status (
  id BIGINT NOT NULL AUTO_INCREMENT,
  biz_type VARCHAR(32) NOT NULL,
  status_code VARCHAR(64) NOT NULL,
  status_name VARCHAR(100) NOT NULL,
  status_name_en VARCHAR(100) NULL,
  status_name_ko VARCHAR(100) NULL,
  status_level VARCHAR(32) NOT NULL,
  main_status_code VARCHAR(64) NULL,
  customer_status_code VARCHAR(64) NULL,
  progress_node_code VARCHAR(64) NULL,
  is_initial TINYINT NOT NULL DEFAULT 0,
  is_final TINYINT NOT NULL DEFAULT 0,
  is_system_only TINYINT NOT NULL DEFAULT 0,
  allow_manual_set TINYINT NOT NULL DEFAULT 0,
  sort_no INT NOT NULL DEFAULT 0,
  status VARCHAR(32) NOT NULL DEFAULT 'ENABLED',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_wf_status_biz_type_status_code (biz_type, status_code),
  KEY idx_wf_status_level_sort (biz_type, status_level, sort_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE wf_action (
  id BIGINT NOT NULL AUTO_INCREMENT,
  biz_type VARCHAR(32) NOT NULL,
  action_code VARCHAR(64) NOT NULL,
  action_name VARCHAR(100) NOT NULL,
  action_type VARCHAR(32) NOT NULL,
  need_remark TINYINT NOT NULL DEFAULT 0,
  need_attachment TINYINT NOT NULL DEFAULT 0,
  need_confirm TINYINT NOT NULL DEFAULT 0,
  need_operator TINYINT NOT NULL DEFAULT 1,
  status VARCHAR(32) NOT NULL DEFAULT 'ENABLED',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_wf_action_biz_type_action_code (biz_type, action_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE wf_transition (
  id BIGINT NOT NULL AUTO_INCREMENT,
  biz_type VARCHAR(32) NOT NULL,
  from_status_code VARCHAR(64) NOT NULL,
  action_code VARCHAR(64) NOT NULL,
  to_status_code VARCHAR(64) NOT NULL,
  transition_type VARCHAR(32) NOT NULL,
  role_code VARCHAR(64) NULL,
  is_system_only TINYINT NOT NULL DEFAULT 0,
  condition_expr TEXT NULL,
  condition_desc VARCHAR(255) NULL,
  priority INT NOT NULL DEFAULT 0,
  status VARCHAR(32) NOT NULL DEFAULT 'ENABLED',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_wf_transition_core (biz_type, from_status_code, action_code, to_status_code),
  KEY idx_wf_transition_from_action_priority (biz_type, from_status_code, action_code, priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE wf_action_permission (
  id BIGINT NOT NULL AUTO_INCREMENT,
  biz_type VARCHAR(32) NOT NULL,
  status_code VARCHAR(64) NOT NULL,
  action_code VARCHAR(64) NOT NULL,
  role_code VARCHAR(64) NOT NULL,
  allow_execute TINYINT NOT NULL DEFAULT 1,
  status VARCHAR(32) NOT NULL DEFAULT 'ENABLED',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_wf_action_permission_core (biz_type, status_code, action_code, role_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE wf_auto_rule (
  id BIGINT NOT NULL AUTO_INCREMENT,
  biz_type VARCHAR(32) NOT NULL,
  rule_code VARCHAR(64) NOT NULL,
  from_status_code VARCHAR(64) NOT NULL,
  action_code VARCHAR(64) NOT NULL,
  trigger_mode VARCHAR(32) NOT NULL,
  trigger_expr TEXT NULL,
  calendar_type VARCHAR(32) NULL,
  is_holiday_excluded TINYINT NOT NULL DEFAULT 0,
  retryable TINYINT NOT NULL DEFAULT 1,
  status VARCHAR(32) NOT NULL DEFAULT 'ENABLED',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_wf_auto_rule_biz_type_rule_code (biz_type, rule_code),
  KEY idx_wf_auto_rule_from_status_mode (biz_type, from_status_code, trigger_mode)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE ticket (
  id BIGINT NOT NULL AUTO_INCREMENT,
  ticket_no VARCHAR(64) NOT NULL,
  source_request_no VARCHAR(64) NULL,
  apply_channel VARCHAR(32) NULL,
  original_ticket_no VARCHAR(64) NULL,
  barcode_no VARCHAR(64) NULL,
  so_no VARCHAR(64) NULL,
  customer_id BIGINT NULL,
  store_id BIGINT NULL,
  product_id BIGINT NULL,
  main_status_code VARCHAR(64) NOT NULL,
  biz_status_code VARCHAR(64) NOT NULL,
  customer_status_code VARCHAR(64) NULL,
  current_payment_status VARCHAR(64) NULL,
  current_repair_status VARCHAR(64) NULL,
  current_fulfillment_status VARCHAR(64) NULL,
  judge_owner_id BIGINT NULL,
  service_engineer_id BIGINT NULL,
  last_action_code VARCHAR(64) NULL,
  last_action_at DATETIME NULL,
  last_action_by BIGINT NULL,
  service_completed_at DATETIME NULL,
  closed_at DATETIME NULL,
  version_no INT NOT NULL DEFAULT 1,
  created_by BIGINT NULL,
  updated_by BIGINT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uk_ticket_no (ticket_no),
  UNIQUE KEY uk_barcode_no (barcode_no),
  UNIQUE KEY uk_source_request_no (source_request_no),
  KEY idx_ticket_status_created (main_status_code, biz_status_code, created_at),
  KEY idx_ticket_customer_created (customer_id, created_at),
  KEY idx_ticket_judge_status (judge_owner_id, biz_status_code),
  KEY idx_ticket_engineer_status (service_engineer_id, biz_status_code),
  KEY idx_ticket_source_request_no (source_request_no),
  CONSTRAINT fk_ticket_customer_id FOREIGN KEY (customer_id) REFERENCES customer(id),
  CONSTRAINT fk_ticket_store_id FOREIGN KEY (store_id) REFERENCES store(id),
  CONSTRAINT fk_ticket_product_id FOREIGN KEY (product_id) REFERENCES product(id),
  CONSTRAINT fk_ticket_judge_owner_id FOREIGN KEY (judge_owner_id) REFERENCES sys_user(id),
  CONSTRAINT fk_ticket_service_engineer_id FOREIGN KEY (service_engineer_id) REFERENCES sys_user(id),
  CONSTRAINT fk_ticket_last_action_by FOREIGN KEY (last_action_by) REFERENCES sys_user(id),
  CONSTRAINT fk_ticket_created_by FOREIGN KEY (created_by) REFERENCES sys_user(id),
  CONSTRAINT fk_ticket_updated_by FOREIGN KEY (updated_by) REFERENCES sys_user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE ticket_snapshot (
  id BIGINT NOT NULL AUTO_INCREMENT,
  ticket_id BIGINT NOT NULL,
  customer_name VARCHAR(100) NOT NULL,
  customer_phone VARCHAR(32) NOT NULL,
  customer_email VARCHAR(100) NULL,
  country_code VARCHAR(50) NULL,
  receive_type VARCHAR(32) NULL,
  receive_address VARCHAR(255) NULL,
  receive_channel_type VARCHAR(64) NULL,
  receive_channel VARCHAR(100) NULL,
  receive_store_code VARCHAR(64) NULL,
  receive_store_name VARCHAR(100) NULL,
  purchase_date DATE NULL,
  purchase_channel VARCHAR(100) NULL,
  customer_request TEXT NULL,
  product_code VARCHAR(64) NULL,
  product_name VARCHAR(200) NULL,
  product_category VARCHAR(64) NULL,
  selected_factory_code VARCHAR(64) NULL,
  selected_factory_name VARCHAR(100) NULL,
  part_code VARCHAR(64) NULL,
  part_name VARCHAR(200) NULL,
  part_location VARCHAR(100) NULL,
  has_purchase_proof TINYINT NOT NULL DEFAULT 0,
  has_accessories TINYINT NOT NULL DEFAULT 0,
  has_warranty_card TINYINT NOT NULL DEFAULT 0,
  accessory_types_json JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_ticket_snapshot_ticket_id (ticket_id),
  CONSTRAINT fk_ticket_snapshot_ticket_id FOREIGN KEY (ticket_id) REFERENCES ticket(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE ticket_repair (
  id BIGINT NOT NULL AUTO_INCREMENT,
  ticket_id BIGINT NOT NULL,
  hq_inbound_date DATETIME NULL,
  expected_outbound_date DATE NULL,
  expected_completion_date DATE NULL,
  transfer_hq_date DATE NULL,
  hq_return_signed_date DATE NULL,
  phenomenon VARCHAR(100) NULL,
  issue_phenomenon VARCHAR(100) NULL,
  lens_type VARCHAR(64) NULL,
  repair_location VARCHAR(100) NULL,
  repair_type VARCHAR(64) NULL,
  repair_content VARCHAR(64) NULL,
  selected_factory_code VARCHAR(64) NULL,
  selected_factory_name VARCHAR(100) NULL,
  replacement_product_code VARCHAR(64) NULL,
  replacement_product_name VARCHAR(200) NULL,
  repair_again_reason VARCHAR(100) NULL,
  is_product_issue TINYINT NOT NULL DEFAULT 0,
  repair_fee_type VARCHAR(32) NULL,
  repair_fee_percent DECIMAL(10,2) NULL,
  base_price_amount DECIMAL(10,2) NULL,
  repair_fee_amount DECIMAL(10,2) NULL,
  currency_code VARCHAR(16) NULL,
  repair_reference_note TEXT NULL,
  repair_started_at DATETIME NULL,
  repair_completed_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_ticket_repair_ticket_id (ticket_id),
  CONSTRAINT fk_ticket_repair_ticket_id FOREIGN KEY (ticket_id) REFERENCES ticket(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE ticket_payment (
  id BIGINT NOT NULL AUTO_INCREMENT,
  ticket_id BIGINT NOT NULL,
  payment_order_no VARCHAR(64) NOT NULL,
  payment_status VARCHAR(64) NOT NULL,
  payment_amount DECIMAL(10,2) NULL,
  payment_method VARCHAR(50) NULL,
  payment_auth_no VARCHAR(100) NULL,
  payment_txn_no VARCHAR(100) NULL,
  final_payment_request_no VARCHAR(100) NULL,
  sign_verified TINYINT NOT NULL DEFAULT 0,
  last_callback_at DATETIME NULL,
  last_compensation_at DATETIME NULL,
  last_compensation_result VARCHAR(32) NULL,
  quoted_at DATETIME NULL,
  payable_start_at DATETIME NULL,
  payment_deadline DATE NULL,
  paid_at DATETIME NULL,
  payment_link VARCHAR(500) NULL,
  is_payment_cancelled TINYINT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_ticket_payment_payment_order_no (payment_order_no),
  KEY idx_ticket_payment_ticket_status (ticket_id, payment_status),
  KEY idx_ticket_payment_status_deadline (payment_status, payment_deadline),
  KEY idx_ticket_payment_txn_no (payment_txn_no),
  CONSTRAINT fk_ticket_payment_ticket_id FOREIGN KEY (ticket_id) REFERENCES ticket(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE ticket_payment_event_log (
  id BIGINT NOT NULL AUTO_INCREMENT,
  ticket_payment_id BIGINT NOT NULL,
  ticket_id BIGINT NOT NULL,
  event_type VARCHAR(32) NOT NULL,
  event_source VARCHAR(32) NULL,
  event_result VARCHAR(32) NULL,
  payment_result VARCHAR(32) NULL,
  payment_status VARCHAR(64) NULL,
  request_payload LONGTEXT NULL,
  response_payload LONGTEXT NULL,
  raw_payload LONGTEXT NULL,
  event_time DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_ticket_payment_event_log_payment_time (ticket_payment_id, event_time),
  KEY idx_ticket_payment_event_log_ticket_type_time (ticket_id, event_type, event_time),
  CONSTRAINT fk_ticket_payment_event_log_payment_id FOREIGN KEY (ticket_payment_id) REFERENCES ticket_payment(id),
  CONSTRAINT fk_ticket_payment_event_log_ticket_id FOREIGN KEY (ticket_id) REFERENCES ticket(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE ticket_refund (
  id BIGINT NOT NULL AUTO_INCREMENT,
  ticket_id BIGINT NOT NULL,
  ticket_payment_id BIGINT NOT NULL,
  refund_no VARCHAR(64) NOT NULL,
  refund_status VARCHAR(64) NOT NULL,
  refund_amount DECIMAL(10,2) NULL,
  refund_time DATETIME NULL,
  refund_result VARCHAR(100) NULL,
  refund_reason TEXT NULL,
  operator_id BIGINT NULL,
  remark TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_ticket_refund_refund_no (refund_no),
  KEY idx_ticket_refund_ticket_id (ticket_id),
  KEY idx_ticket_refund_ticket_payment_id (ticket_payment_id),
  KEY idx_ticket_refund_status (refund_status),
  CONSTRAINT fk_ticket_refund_ticket_id FOREIGN KEY (ticket_id) REFERENCES ticket(id),
  CONSTRAINT fk_ticket_refund_ticket_payment_id FOREIGN KEY (ticket_payment_id) REFERENCES ticket_payment(id),
  CONSTRAINT fk_ticket_refund_operator_id FOREIGN KEY (operator_id) REFERENCES sys_user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE ticket_fulfillment (
  id BIGINT NOT NULL AUTO_INCREMENT,
  ticket_id BIGINT NOT NULL,
  delivery_method VARCHAR(32) NULL,
  delivery_status VARCHAR(64) NULL,
  carrier_name VARCHAR(100) NULL,
  tracking_no VARCHAR(100) NULL,
  outbound_ready_at DATETIME NULL,
  outbound_completed_at DATETIME NULL,
  delivery_started_at DATETIME NULL,
  delivered_at DATETIME NULL,
  signed_at DATETIME NULL,
  store_arrived_at DATETIME NULL,
  store_received_at DATETIME NULL,
  customer_picked_at DATETIME NULL,
  visible_remark_3pl TEXT NULL,
  remark TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_ticket_fulfillment_ticket_id (ticket_id),
  KEY idx_ticket_fulfillment_status_tracking (delivery_status, tracking_no),
  CONSTRAINT fk_ticket_fulfillment_ticket_id FOREIGN KEY (ticket_id) REFERENCES ticket(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE ticket_inbound_logistics (
  id BIGINT NOT NULL AUTO_INCREMENT,
  ticket_id BIGINT NOT NULL,
  customer_phone VARCHAR(32) NULL,
  carrier_name VARCHAR(100) NULL,
  tracking_no VARCHAR(100) NULL,
  shipped_at DATETIME NULL,
  remark TEXT NULL,
  submit_source VARCHAR(32) NULL,
  shipping_info_status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
  submitted_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_ticket_inbound_logistics_ticket_id (ticket_id),
  KEY idx_ticket_inbound_logistics_tracking_no (tracking_no),
  KEY idx_ticket_inbound_logistics_phone_submitted (customer_phone, submitted_at),
  CONSTRAINT fk_ticket_inbound_logistics_ticket_id FOREIGN KEY (ticket_id) REFERENCES ticket(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE ticket_consultation (
  id BIGINT NOT NULL AUTO_INCREMENT,
  ticket_id BIGINT NOT NULL,
  consultation_no VARCHAR(64) NOT NULL,
  item_type VARCHAR(32) NOT NULL,
  outbound_type VARCHAR(64) NULL,
  consultation_channel VARCHAR(64) NULL,
  consultation_category VARCHAR(64) NULL,
  consultation_demand_category VARCHAR(64) NULL,
  subject VARCHAR(200) NULL,
  content TEXT NULL,
  status VARCHAR(64) NOT NULL,
  need_customer_confirm TINYINT NOT NULL DEFAULT 0,
  customer_confirm_result VARCHAR(64) NULL,
  confirm_source VARCHAR(32) NULL,
  launched_at DATETIME NULL,
  confirm_deadline DATETIME NULL,
  confirmed_at DATETIME NULL,
  owner_id BIGINT NULL,
  confirm_payload_json TEXT NULL,
  confirm_notice_count INT NOT NULL DEFAULT 0,
  last_contact_record TEXT NULL,
  need_manual_follow_up TINYINT NOT NULL DEFAULT 0,
  follow_up_result TEXT NULL,
  is_timeout TINYINT NOT NULL DEFAULT 0,
  timeout_at DATETIME NULL,
  process_result TEXT NULL,
  is_blocking_main_flow TINYINT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_ticket_consultation_consultation_no (consultation_no),
  KEY idx_ticket_consultation_ticket_status (ticket_id, status),
  KEY idx_ticket_consultation_owner_status (owner_id, status, launched_at),
  CONSTRAINT fk_ticket_consultation_ticket_id FOREIGN KEY (ticket_id) REFERENCES ticket(id),
  CONSTRAINT fk_ticket_consultation_owner_id FOREIGN KEY (owner_id) REFERENCES sys_user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE ticket_cancel_log (
  id BIGINT NOT NULL AUTO_INCREMENT,
  ticket_id BIGINT NOT NULL,
  cancel_source VARCHAR(32) NOT NULL,
  cancel_reason VARCHAR(200) NULL,
  cancel_remark TEXT NULL,
  apply_time DATETIME NULL,
  cancel_result VARCHAR(32) NOT NULL,
  result_reason TEXT NULL,
  processed_at DATETIME NULL,
  processed_by BIGINT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_ticket_cancel_log_ticket_created (ticket_id, created_at),
  KEY idx_ticket_cancel_log_source_apply (cancel_source, apply_time),
  CONSTRAINT fk_ticket_cancel_log_ticket_id FOREIGN KEY (ticket_id) REFERENCES ticket(id),
  CONSTRAINT fk_ticket_cancel_log_processed_by FOREIGN KEY (processed_by) REFERENCES sys_user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE ticket_consultation_attachment (
  id BIGINT NOT NULL AUTO_INCREMENT,
  consultation_id BIGINT NOT NULL,
  attachment_type VARCHAR(32) NOT NULL,
  file_name VARCHAR(255) NULL,
  file_url VARCHAR(500) NOT NULL,
  sort_no INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_ticket_consultation_attachment_consultation_id (consultation_id),
  CONSTRAINT fk_ticket_consultation_attachment_consultation_id FOREIGN KEY (consultation_id) REFERENCES ticket_consultation(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE ticket_attachment (
  id BIGINT NOT NULL AUTO_INCREMENT,
  ticket_id BIGINT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  title VARCHAR(200) NULL,
  file_type VARCHAR(50) NULL,
  file_size BIGINT NULL,
  file_url VARCHAR(500) NOT NULL,
  uploaded_by BIGINT NULL,
  uploaded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_by BIGINT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_ticket_attachment_ticket_id_uploaded_at (ticket_id, uploaded_at),
  CONSTRAINT fk_ticket_attachment_ticket_id FOREIGN KEY (ticket_id) REFERENCES ticket(id),
  CONSTRAINT fk_ticket_attachment_uploaded_by FOREIGN KEY (uploaded_by) REFERENCES sys_user(id),
  CONSTRAINT fk_ticket_attachment_updated_by FOREIGN KEY (updated_by) REFERENCES sys_user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE ticket_progress (
  id BIGINT NOT NULL AUTO_INCREMENT,
  ticket_id BIGINT NOT NULL,
  progress_time DATETIME NOT NULL,
  progress_type VARCHAR(64) NOT NULL,
  progress_title VARCHAR(200) NULL,
  progress_content TEXT NULL,
  source_type VARCHAR(32) NOT NULL,
  is_customer_visible TINYINT NOT NULL DEFAULT 1,
  created_by BIGINT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_ticket_progress_ticket_time (ticket_id, progress_time),
  KEY idx_ticket_progress_ticket_visible (ticket_id, is_customer_visible),
  CONSTRAINT fk_ticket_progress_ticket_id FOREIGN KEY (ticket_id) REFERENCES ticket(id),
  CONSTRAINT fk_ticket_progress_created_by FOREIGN KEY (created_by) REFERENCES sys_user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE ticket_status_log (
  id BIGINT NOT NULL AUTO_INCREMENT,
  ticket_id BIGINT NOT NULL,
  from_status_code VARCHAR(64) NULL,
  action_code VARCHAR(64) NOT NULL,
  to_status_code VARCHAR(64) NOT NULL,
  trigger_type VARCHAR(32) NOT NULL,
  operator_id BIGINT NULL,
  operator_role_code VARCHAR(64) NULL,
  trigger_source VARCHAR(100) NULL,
  remark TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_ticket_status_log_ticket_created (ticket_id, created_at),
  KEY idx_ticket_status_log_action_created (action_code, created_at),
  CONSTRAINT fk_ticket_status_log_ticket_id FOREIGN KEY (ticket_id) REFERENCES ticket(id),
  CONSTRAINT fk_ticket_status_log_operator_id FOREIGN KEY (operator_id) REFERENCES sys_user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE ticket_action_log (
  id BIGINT NOT NULL AUTO_INCREMENT,
  ticket_id BIGINT NOT NULL,
  action_code VARCHAR(64) NOT NULL,
  action_name VARCHAR(100) NULL,
  execute_result VARCHAR(32) NOT NULL,
  fail_reason TEXT NULL,
  request_payload JSON NULL,
  operator_id BIGINT NULL,
  executed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_ticket_action_log_ticket_executed (ticket_id, executed_at),
  KEY idx_ticket_action_log_action_result (action_code, execute_result),
  CONSTRAINT fk_ticket_action_log_ticket_id FOREIGN KEY (ticket_id) REFERENCES ticket(id),
  CONSTRAINT fk_ticket_action_log_operator_id FOREIGN KEY (operator_id) REFERENCES sys_user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE ticket_exception (
  id BIGINT NOT NULL AUTO_INCREMENT,
  ticket_id BIGINT NOT NULL,
  exception_type VARCHAR(64) NOT NULL,
  exception_code VARCHAR(64) NULL,
  exception_status VARCHAR(32) NOT NULL,
  exception_content TEXT NULL,
  owner_id BIGINT NULL,
  process_result TEXT NULL,
  occurred_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolved_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_ticket_exception_ticket_occurred (ticket_id, occurred_at),
  KEY idx_ticket_exception_status_owner (exception_status, owner_id),
  CONSTRAINT fk_ticket_exception_ticket_id FOREIGN KEY (ticket_id) REFERENCES ticket(id),
  CONSTRAINT fk_ticket_exception_owner_id FOREIGN KEY (owner_id) REFERENCES sys_user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE ticket_available_action (
  id BIGINT NOT NULL AUTO_INCREMENT,
  ticket_id BIGINT NOT NULL,
  action_code VARCHAR(64) NOT NULL,
  action_name VARCHAR(100) NULL,
  source_status_code VARCHAR(64) NOT NULL,
  is_enabled TINYINT NOT NULL DEFAULT 1,
  disabled_reason VARCHAR(255) NULL,
  generated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_ticket_available_action_ticket_action (ticket_id, action_code),
  KEY idx_ticket_available_action_ticket_enabled (ticket_id, is_enabled),
  CONSTRAINT fk_ticket_available_action_ticket_id FOREIGN KEY (ticket_id) REFERENCES ticket(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE inventory_balance (
  id BIGINT NOT NULL AUTO_INCREMENT,
  item_type VARCHAR(32) NOT NULL,
  product_id BIGINT NULL,
  part_id BIGINT NULL,
  warehouse_code VARCHAR(64) NOT NULL,
  location_code VARCHAR(64) NOT NULL,
  sap_qty INT NOT NULL DEFAULT 0,
  ps_qty INT NOT NULL DEFAULT 0,
  frozen_qty INT NOT NULL DEFAULT 0,
  transit_qty INT NOT NULL DEFAULT 0,
  available_qty INT NOT NULL DEFAULT 0,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_inventory_balance_core (item_type, product_id, part_id, warehouse_code, location_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE inventory_txn (
  id BIGINT NOT NULL AUTO_INCREMENT,
  txn_no VARCHAR(64) NOT NULL,
  item_type VARCHAR(32) NOT NULL,
  product_id BIGINT NULL,
  part_id BIGINT NULL,
  record_type VARCHAR(64) NOT NULL,
  biz_doc_type VARCHAR(64) NULL,
  biz_doc_no VARCHAR(64) NULL,
  related_txn_no VARCHAR(64) NULL,
  warehouse_code VARCHAR(64) NOT NULL,
  location_code VARCHAR(64) NOT NULL,
  qty_before INT NOT NULL DEFAULT 0,
  change_qty INT NOT NULL DEFAULT 0,
  qty_after INT NOT NULL DEFAULT 0,
  change_direction VARCHAR(32) NOT NULL,
  source_type VARCHAR(64) NULL,
  source_no VARCHAR(64) NULL,
  operated_by BIGINT NULL,
  operated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  remark TEXT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_inventory_txn_txn_no (txn_no),
  KEY idx_inventory_txn_item_operated (item_type, product_id, part_id, operated_at),
  KEY idx_inventory_txn_doc_no (biz_doc_type, biz_doc_no),
  KEY idx_inventory_txn_warehouse_location_time (warehouse_code, location_code, operated_at),
  CONSTRAINT fk_inventory_txn_operated_by FOREIGN KEY (operated_by) REFERENCES sys_user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE inventory_request (
  id BIGINT NOT NULL AUTO_INCREMENT,
  request_no VARCHAR(64) NOT NULL,
  ticket_id BIGINT NULL,
  product_id BIGINT NOT NULL,
  request_type VARCHAR(64) NULL,
  request_qty INT NOT NULL DEFAULT 1,
  progress_status VARCHAR(32) NOT NULL,
  request_reason TEXT NULL,
  requester_id BIGINT NULL,
  processor_id BIGINT NULL,
  process_time DATETIME NULL,
  remark TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_inventory_request_request_no (request_no),
  KEY idx_inventory_request_ticket_status (ticket_id, progress_status),
  KEY idx_inventory_request_processor_status (processor_id, progress_status),
  CONSTRAINT fk_inventory_request_ticket_id FOREIGN KEY (ticket_id) REFERENCES ticket(id),
  CONSTRAINT fk_inventory_request_product_id FOREIGN KEY (product_id) REFERENCES product(id),
  CONSTRAINT fk_inventory_request_requester_id FOREIGN KEY (requester_id) REFERENCES sys_user(id),
  CONSTRAINT fk_inventory_request_processor_id FOREIGN KEY (processor_id) REFERENCES sys_user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE part_request (
  id BIGINT NOT NULL AUTO_INCREMENT,
  part_request_no VARCHAR(64) NOT NULL,
  ticket_id BIGINT NULL,
  requester_id BIGINT NULL,
  requester_store_id BIGINT NULL,
  product_id BIGINT NULL,
  part_id BIGINT NOT NULL,
  color VARCHAR(50) NULL,
  request_qty INT NOT NULL DEFAULT 1,
  extra_request TEXT NULL,
  progress_status VARCHAR(32) NOT NULL,
  processor_id BIGINT NULL,
  process_time DATETIME NULL,
  remark TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_part_request_part_request_no (part_request_no),
  KEY idx_part_request_ticket_status (ticket_id, progress_status),
  KEY idx_part_request_processor_status (processor_id, progress_status),
  CONSTRAINT fk_part_request_ticket_id FOREIGN KEY (ticket_id) REFERENCES ticket(id),
  CONSTRAINT fk_part_request_requester_id FOREIGN KEY (requester_id) REFERENCES sys_user(id),
  CONSTRAINT fk_part_request_requester_store_id FOREIGN KEY (requester_store_id) REFERENCES store(id),
  CONSTRAINT fk_part_request_product_id FOREIGN KEY (product_id) REFERENCES product(id),
  CONSTRAINT fk_part_request_part_id FOREIGN KEY (part_id) REFERENCES part(id),
  CONSTRAINT fk_part_request_processor_id FOREIGN KEY (processor_id) REFERENCES sys_user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE inventory_diff (
  id BIGINT NOT NULL AUTO_INCREMENT,
  diff_no VARCHAR(64) NOT NULL,
  diff_source VARCHAR(64) NOT NULL,
  item_type VARCHAR(32) NOT NULL,
  product_id BIGINT NULL,
  part_id BIGINT NULL,
  warehouse_code VARCHAR(64) NOT NULL,
  location_code VARCHAR(64) NOT NULL,
  sap_qty INT NOT NULL DEFAULT 0,
  ps_qty INT NOT NULL DEFAULT 0,
  diff_qty INT NOT NULL DEFAULT 0,
  diff_reason VARCHAR(64) NULL,
  process_method VARCHAR(64) NULL,
  fix_qty INT NULL,
  result_no VARCHAR(64) NULL,
  process_status VARCHAR(32) NOT NULL,
  processor_id BIGINT NULL,
  found_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  process_time DATETIME NULL,
  process_desc TEXT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_inventory_diff_diff_no (diff_no),
  KEY idx_inventory_diff_status_found (process_status, found_at),
  KEY idx_inventory_diff_item (item_type, product_id, part_id),
  KEY idx_inventory_diff_warehouse_location (warehouse_code, location_code),
  CONSTRAINT fk_inventory_diff_processor_id FOREIGN KEY (processor_id) REFERENCES sys_user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE inventory_sync_log (
  id BIGINT NOT NULL AUTO_INCREMENT,
  sync_batch_no VARCHAR(64) NOT NULL,
  sync_object VARCHAR(64) NOT NULL,
  sync_type VARCHAR(64) NOT NULL,
  trigger_type VARCHAR(32) NOT NULL,
  status VARCHAR(32) NOT NULL,
  success_count INT NOT NULL DEFAULT 0,
  fail_count INT NOT NULL DEFAULT 0,
  diff_count INT NOT NULL DEFAULT 0,
  source_system VARCHAR(64) NOT NULL DEFAULT 'SAP',
  target_system VARCHAR(64) NOT NULL DEFAULT 'PS_ADMIN',
  job_name VARCHAR(100) NULL,
  executor_name VARCHAR(100) NULL,
  started_at DATETIME NULL,
  ended_at DATETIME NULL,
  error_summary TEXT NULL,
  fail_detail LONGTEXT NULL,
  process_result TEXT NULL,
  remark TEXT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_inventory_sync_log_sync_batch_no (sync_batch_no),
  KEY idx_inventory_sync_log_object_status_started (sync_object, status, started_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE survey_template (
  id BIGINT NOT NULL AUTO_INCREMENT,
  template_no VARCHAR(64) NOT NULL,
  template_name VARCHAR(200) NOT NULL,
  template_desc TEXT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'ENABLED',
  question_count INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_survey_template_template_no (template_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE survey_template_question (
  id BIGINT NOT NULL AUTO_INCREMENT,
  template_id BIGINT NOT NULL,
  sort_no INT NOT NULL DEFAULT 0,
  question_no VARCHAR(64) NOT NULL,
  question_title VARCHAR(200) NOT NULL,
  question_type VARCHAR(32) NOT NULL,
  is_required TINYINT NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_survey_template_question_template_question_no (template_id, question_no),
  KEY idx_survey_template_question_template_sort (template_id, sort_no),
  CONSTRAINT fk_survey_template_question_template_id FOREIGN KEY (template_id) REFERENCES survey_template(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE survey_template_option (
  id BIGINT NOT NULL AUTO_INCREMENT,
  question_id BIGINT NOT NULL,
  sort_no INT NOT NULL DEFAULT 0,
  option_no VARCHAR(64) NOT NULL,
  option_text VARCHAR(200) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_survey_template_option_question_option_no (question_id, option_no),
  KEY idx_survey_template_option_question_sort (question_id, sort_no),
  CONSTRAINT fk_survey_template_option_question_id FOREIGN KEY (question_id) REFERENCES survey_template_question(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE survey_task (
  id BIGINT NOT NULL AUTO_INCREMENT,
  survey_no VARCHAR(64) NOT NULL,
  ticket_id BIGINT NOT NULL,
  template_id BIGINT NULL,
  survey_title VARCHAR(200) NULL,
  survey_desc TEXT NULL,
  survey_status VARCHAR(32) NOT NULL,
  deadline_at DATETIME NULL,
  allow_submit TINYINT NOT NULL DEFAULT 1,
  question_count INT NOT NULL DEFAULT 0,
  submitted_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_survey_task_survey_no (survey_no),
  KEY idx_survey_task_ticket_status (ticket_id, survey_status),
  CONSTRAINT fk_survey_task_ticket_id FOREIGN KEY (ticket_id) REFERENCES ticket(id),
  CONSTRAINT fk_survey_task_template_id FOREIGN KEY (template_id) REFERENCES survey_template(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE survey_answer (
  id BIGINT NOT NULL AUTO_INCREMENT,
  survey_task_id BIGINT NOT NULL,
  question_id BIGINT NOT NULL,
  question_no VARCHAR(64) NOT NULL,
  question_title VARCHAR(200) NOT NULL,
  question_type VARCHAR(32) NOT NULL,
  answer_option_no VARCHAR(64) NULL,
  answer_option_text VARCHAR(200) NULL,
  answer_score DECIMAL(10,2) NULL,
  answer_text TEXT NULL,
  submitted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_survey_answer_task_id (survey_task_id),
  KEY idx_survey_answer_question_id (question_id),
  CONSTRAINT fk_survey_answer_survey_task_id FOREIGN KEY (survey_task_id) REFERENCES survey_task(id),
  CONSTRAINT fk_survey_answer_question_id FOREIGN KEY (question_id) REFERENCES survey_template_question(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE notification_template (
  id BIGINT NOT NULL AUTO_INCREMENT,
  template_code VARCHAR(64) NOT NULL,
  template_type VARCHAR(64) NOT NULL,
  template_name VARCHAR(200) NOT NULL,
  template_title VARCHAR(200) NULL,
  template_content LONGTEXT NULL,
  business_scene VARCHAR(100) NULL,
  trigger_node VARCHAR(100) NULL,
  lang_code VARCHAR(20) NULL,
  variable_desc TEXT NULL,
  is_default TINYINT NOT NULL DEFAULT 0,
  status VARCHAR(32) NOT NULL DEFAULT 'ENABLED',
  remark TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_notification_template_template_code (template_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE notification_send_log (
  id BIGINT NOT NULL AUTO_INCREMENT,
  ticket_id BIGINT NULL,
  template_id BIGINT NULL,
  message_id VARCHAR(64) NULL,
  event_code VARCHAR(64) NULL,
  event_name VARCHAR(100) NULL,
  biz_no VARCHAR(64) NULL,
  channel_type VARCHAR(32) NOT NULL,
  template_name VARCHAR(200) NULL,
  receiver VARCHAR(255) NULL,
  receiver_type VARCHAR(32) NULL,
  summary VARCHAR(500) NULL,
  event_time DATETIME NULL,
  sent_at DATETIME NULL,
  send_status VARCHAR(32) NOT NULL,
  retry_count INT NOT NULL DEFAULT 0,
  fail_reason TEXT NULL,
  callback_url VARCHAR(500) NULL,
  request_payload TEXT NULL,
  response_payload TEXT NULL,
  created_by BIGINT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_notification_send_log_message_id (message_id),
  KEY idx_notification_send_log_ticket_sent_at (ticket_id, sent_at),
  KEY idx_notification_send_log_event_code_time (event_code, event_time),
  CONSTRAINT fk_notification_send_log_ticket_id FOREIGN KEY (ticket_id) REFERENCES ticket(id),
  CONSTRAINT fk_notification_send_log_template_id FOREIGN KEY (template_id) REFERENCES notification_template(id),
  CONSTRAINT fk_notification_send_log_created_by FOREIGN KEY (created_by) REFERENCES sys_user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE sys_dict_item (
  id BIGINT NOT NULL AUTO_INCREMENT,
  dict_type VARCHAR(64) NOT NULL,
  dict_code VARCHAR(64) NOT NULL,
  dict_name VARCHAR(100) NOT NULL,
  dict_name_en VARCHAR(100) NULL,
  dict_name_ko VARCHAR(100) NULL,
  parent_id BIGINT NULL,
  sort_no INT NOT NULL DEFAULT 0,
  is_default TINYINT NOT NULL DEFAULT 0,
  status VARCHAR(32) NOT NULL DEFAULT 'ENABLED',
  ext_value_1 VARCHAR(255) NULL,
  ext_value_2 VARCHAR(255) NULL,
  remark TEXT NULL,
  updated_by BIGINT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_sys_dict_item_dict_code (dict_code),
  KEY idx_sys_dict_item_type_sort (dict_type, sort_no),
  KEY idx_sys_dict_item_parent_id (parent_id),
  CONSTRAINT fk_sys_dict_item_parent_id FOREIGN KEY (parent_id) REFERENCES sys_dict_item(id),
  CONSTRAINT fk_sys_dict_item_updated_by FOREIGN KEY (updated_by) REFERENCES sys_user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE external_interface_config (
  id BIGINT NOT NULL AUTO_INCREMENT,
  system_code VARCHAR(64) NOT NULL,
  interface_type VARCHAR(64) NOT NULL,
  interface_name VARCHAR(100) NULL,
  endpoint_url VARCHAR(500) NOT NULL,
  http_method VARCHAR(16) NULL,
  sign_algorithm VARCHAR(64) NULL,
  sign_secret VARCHAR(255) NULL,
  timeout_ms INT NOT NULL DEFAULT 5000,
  status VARCHAR(32) NOT NULL DEFAULT 'ENABLED',
  remark TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_external_interface_config_system_type (system_code, interface_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SET FOREIGN_KEY_CHECKS = 1;
