# 1 设计说明

本章用于定义系统核心业务数据模型，作为数据库设计、接口开发、状态流转控制、页面展示及后续报表分析的统一依据。

数据模型设计遵循以下原则：

- 以售后工单 `service_ticket` 为核心主表
    
- 以状态表 `service_status` 与状态流转表 `service_status_flow` 统一管理流程状态
    
- 所有过程型数据按业务域拆分，避免工单主表字段过度膨胀
    
- 所有关键动作需保留日志与历史记录
    
- 所有对外协同数据应具备可追踪、可重试、可对账能力
    
- 统一采用 `BIGINT` 作为主键
    
- 统一采用 `created_at / updated_at` 作为时间字段命名
    
- 统一采用 `is_deleted` 作为逻辑删除标识（如适用）
    


# 2 权限与组织模型

### 用户 sys_user

|字段名称|字段Key|数据类型|必填|默认值|逻辑规则|说明|
|---|---|---|---|---|---|---|
|主键ID|id|BIGINT|是|-|主键|用户表主键，系统内部唯一标识|
|用户ID|user_id|VARCHAR(50)|是|-|唯一约束|用户唯一标识，用于区分账号|
|姓名|user_name|VARCHAR(100)|是|-|-|用户姓名|
|生效日期|effective_date|DATE|否|-|-|账号生效日期|
|到期日期|expiry_date|DATE|否|-|-|账号到期日期|
|部门|dept|VARCHAR(100)|否|-|-|所属部门|
|职务|work|VARCHAR(100)|否|-|-|岗位/职务|
|角色ID|role_id|BIGINT|否|-|可冗余默认角色|默认角色ID|
|联系电话|phone|VARCHAR(30)|否|-|-|内部联系电话|
|邮箱|email|VARCHAR(100)|否|-|唯一约束|用户邮箱|
|国家|country|VARCHAR(100)|否|-|-|国家/区域信息|
|内部地址|internal_address|VARCHAR(255)|否|-|-|内部办公地址/办公地点|
|IP匹配方式|member_ip_check|VARCHAR(10)|否|N|N=未使用，Y=完全匹配，L=部分匹配|IP校验方式|
|状态|status|CHAR(1)|是|A|A=启用，I=停用|账号状态|
|创建人|created_by|VARCHAR(50)|否|-|-|创建人|
|创建时间|created_at|DATETIME|是|CURRENT_TIMESTAMP|系统自动写入|创建时间|
|更新人|updated_by|VARCHAR(50)|否|-|-|更新人|
|更新时间|updated_at|DATETIME|是|CURRENT_TIMESTAMP|更新时自动刷新|更新时间|
|删除标记|is_deleted|TINYINT(1)|是|0|0=未删除，1=已删除|逻辑删除标记|

### 用户IP白名单 sys_user_ip_whitelist

|字段名称|字段Key|数据类型|必填|默认值|逻辑规则|说明|
|---|---|---|---|---|---|---|
|主键ID|id|BIGINT|是|-|主键|白名单表主键|
|用户主表ID|user_id_ref|BIGINT|是|-|关联 `sys_user.id`|用户主表ID|
|用户ID|user_id|VARCHAR(50)|否|-|冗余存储|业务用户ID，便于查询|
|允许IP|allowed_ip|VARCHAR(100)|是|-|支持单IP、IP段或通配格式|白名单IP地址|
|匹配方式|match_type|VARCHAR(10)|否|Y|Y=完全匹配，L=部分匹配|冗余记录匹配方式|
|排序号|sort_no|INT|否|0|-|多条IP时的展示顺序|
|状态|status|CHAR(1)|是|A|A=启用，I=停用|是否启用|
|创建人|created_by|VARCHAR(50)|否|-|-|创建人|
|创建时间|created_at|DATETIME|是|CURRENT_TIMESTAMP|系统自动写入|创建时间|
|更新人|updated_by|VARCHAR(50)|否|-|-|更新人|
|更新时间|updated_at|DATETIME|是|CURRENT_TIMESTAMP|更新时自动刷新|更新时间|

### 角色 sys_role

|字段名称|字段Key|数据类型|必填|默认值|逻辑规则|说明|
|---|---|---|---|---|---|---|
|主键ID|id|BIGINT|是|-|主键|角色表主键，系统内部唯一标识|
|角色ID|role_id|BIGINT|是|-|唯一|角色业务标识|
|角色编码|role_code|VARCHAR(50)|是|-|唯一约束|角色唯一编码，如 `ADMIN`|
|角色名称|role_name|VARCHAR(100)|是|-|-|角色显示名称|
|角色类型|role_type|VARCHAR(20)|否|-|-|角色类型，如业务角色、系统角色|
|角色状态|status|CHAR(1)|是|A|A=启用，I=停用|角色状态|
|备注|remark|VARCHAR(255)|否|-|-|角色补充说明|
|创建人|created_by|VARCHAR(50)|否|-|-|创建人|
|创建时间|created_at|DATETIME|是|CURRENT_TIMESTAMP|系统自动写入|创建时间|
|更新人|updated_by|VARCHAR(50)|否|-|-|更新人|
|更新时间|updated_at|DATETIME|是|CURRENT_TIMESTAMP|更新时自动刷新|更新时间|
|删除标记|is_deleted|TINYINT(1)|是|0|0=未删除，1=已删除|逻辑删除标记|

### 权限表 sys_permission

|字段名称|字段Key|数据类型|必填|默认值|逻辑规则|说明|
|---|---|---|---|---|---|---|
|主键ID|id|BIGINT|是|-|主键|权限表主键|
|权限ID|permission_id|BIGINT|是|-|唯一|权限业务标识|
|权限编码|permission_code|VARCHAR(100)|是|-|唯一约束|权限唯一编码|
|权限名称|permission_name|VARCHAR(100)|是|-|-|权限显示名称|
|权限类型|permission_type|VARCHAR(20)|是|-|MENU / BUTTON / API / DATA|权限类型|
|父级权限ID|parent_id|BIGINT|否|-|可为空，构建树结构|上级权限ID|
|权限路径|path|VARCHAR(255)|否|-|菜单/API时使用|前端路由或接口路径|
|组件路径|component|VARCHAR(255)|否|-|菜单权限时使用|前端组件路径|
|排序号|sort_no|INT|否|0|-|权限排序|
|是否可见|visible|CHAR(1)|否|Y|Y=是，N=否|是否在菜单中显示|
|权限状态|status|CHAR(1)|是|A|A=启用，I=停用|状态|
|备注|remark|VARCHAR(255)|否|-|-|权限说明|
|创建人|created_by|VARCHAR(50)|否|-|-|创建人|
|创建时间|created_at|DATETIME|是|CURRENT_TIMESTAMP|系统自动写入|创建时间|
|更新人|updated_by|VARCHAR(50)|否|-|-|更新人|
|更新时间|updated_at|DATETIME|是|CURRENT_TIMESTAMP|更新时自动刷新|更新时间|
|删除标记|is_deleted|TINYINT(1)|是|0|0=未删除，1=已删除|逻辑删除标记|

### 权限编码 sys_permission_code

|字段名称|字段Key|数据类型|必填|默认值|逻辑规则|说明|
|---|---|---|---|---|---|---|
|权限名称|permission_name|VARCHAR(100)|是|-|-|权限显示名称|
|权限编码|permission_code|VARCHAR(100)|是|-|唯一约束|权限编码，如 `user.view`|

### 用户角色关系表 sys_user_role

|字段名称|字段Key|数据类型|必填|默认值|逻辑规则|说明|
|---|---|---|---|---|---|---|
|主键ID|id|BIGINT|是|-|主键|关系表主键|
|用户ID|user_id|BIGINT|是|-|关联 `sys_user.id`|用户ID|
|角色ID|role_id|BIGINT|是|-|关联 `sys_role.id`|角色ID|
|创建人|created_by|VARCHAR(50)|否|-|-|创建人|
|创建时间|created_at|DATETIME|是|CURRENT_TIMESTAMP|系统自动写入|创建时间|
|更新人|updated_by|VARCHAR(50)|否|-|-|更新人|
|更新时间|updated_at|DATETIME|是|CURRENT_TIMESTAMP|更新时自动刷新|更新时间|

### 角色权限关系表 sys_role_permission

|字段名称|字段Key|数据类型|必填|默认值|逻辑规则|说明|
|---|---|---|---|---|---|---|
|主键ID|id|BIGINT|是|-|主键|关系表主键|
|角色ID|role_id|BIGINT|是|-|关联 `sys_role.id`|角色ID|
|权限ID|permission_id|BIGINT|是|-|关联 `sys_permission.id`|权限ID|
|创建人|created_by|VARCHAR(50)|否|-|-|创建人|
|创建时间|created_at|DATETIME|是|CURRENT_TIMESTAMP|系统自动写入|创建时间|
|更新人|updated_by|VARCHAR(50)|否|-|-|更新人|
|更新时间|updated_at|DATETIME|是|CURRENT_TIMESTAMP|更新时自动刷新|更新时间|


# 3 工单主模型

### 售后工单 service_ticket

|字段名称|字段Key|数据类型|必填|默认值|逻辑规则|说明|
|---|---|---|---|---|---|---|
|工单ID|id|BIGINT|是|-|主键|主键|
|工单编号|ticket_no|VARCHAR(50)|是|-|唯一业务编号|工单编号|
|父工单ID|parent_ticket_id|BIGINT|否|-|返修/复制场景关联原工单|父工单ID|
|客户ID|customer_id|BIGINT|是|-|关联客户表|客户ID|
|当前状态编码|status_key|VARCHAR(64)|是|-|对应 `service_status.status_key`|工单当前状态|
|受理渠道类型|accept_channel_type|VARCHAR(30)|是|-|小程序 / 门店|受理渠道类型|
|受理渠道|accept_channel|VARCHAR(50)|否|-|-|来源渠道|
|受理门店ID|accept_store_id|BIGINT|否|-|渠道为门店时填写|受理门店ID|
|受理门店名称|accept_store|VARCHAR(100)|否|-|冗余存储|受理门店名称|
|接收日期|receive_date|DATETIME|否|-|-|客户提交或门店创建时间|
|是否再维修|is_re_repair|TINYINT(1)|是|0|0=否，1=是|是否返修|
|是否紧急维修|is_urgent_repair|TINYINT(1)|是|0|返修场景可自动置1|是否紧急|
|SAP服务单号|sap_service_order_no|VARCHAR(50)|否|-|同步SAP后回写|SAP服务单号|
|判定结果|judgement_result|VARCHAR(50)|否|-|与判定表保持一致|有偿/无偿/更换/假货等|
|维修类型|repair_type|VARCHAR(50)|否|-|维修 / 换货 / 3PL / 合作厂家|维修类型|
|维修执行方|repair_vendor_type|VARCHAR(30)|否|-|PS / PARTNER / 3PL|维修执行方|
|返还方式|return_type|VARCHAR(30)|否|-|快递 / 门店自提|返还方式|
|报价金额|quotation_amount|DECIMAL(10,2)|否|0.00|有偿场景写入|报价金额|
|支付状态冗余|payment_status|VARCHAR(32)|否|-|冗余字段，便于列表查询|支付状态|
|物流状态冗余|delivery_status|VARCHAR(32)|否|-|冗余字段，便于列表查询|物流状态|
|完成时间|completed_at|DATETIME|否|-|完成时写入|工单完成时间|
|关闭时间|closed_at|DATETIME|否|-|关闭时写入|工单关闭时间|
|创建人|created_by|VARCHAR(50)|否|-|-|创建人|
|创建时间|created_at|DATETIME|是|CURRENT_TIMESTAMP|系统自动写入|创建时间|
|更新人|updated_by|VARCHAR(50)|否|-|-|更新人|
|更新时间|updated_at|DATETIME|是|CURRENT_TIMESTAMP|更新时自动刷新|更新时间|
|删除标记|is_deleted|TINYINT(1)|是|0|0=未删除，1=已删除|逻辑删除标记|

### 工单产品快照 service_ticket_item

|字段名称|字段Key|数据类型|必填|默认值|逻辑规则|说明|
|---|---|---|---|---|---|---|
|明细ID|id|BIGINT|是|-|主键|主键|
|工单ID|ticket_id|BIGINT|是|-|关联售后工单|工单ID|
|产品ID|product_id|BIGINT|否|-|关联产品主数据|产品ID|
|产品名称|product_name|VARCHAR(200)|是|-|创建工单时快照|产品名称|
|88码|code_88|VARCHAR(50)|否|-|快照保存|产品88码|
|SN码|serial_no|VARCHAR(100)|否|-|-|序列号|
|产品类别|product_category|VARCHAR(100)|否|-|快照保存|产品类别|
|颜色|color|VARCHAR(50)|否|-|-|颜色|
|购买日期|purchase_date|DATE|否|-|-|购买日期|
|购买渠道|purchase_channel|VARCHAR(100)|否|-|-|购买渠道|
|故障描述|problem_desc|TEXT|否|-|-|客户提交的问题描述|
|照片数量|photo_count|INT|否|0|冗余字段|便于列表展示|
|创建时间|created_at|DATETIME|是|CURRENT_TIMESTAMP|系统自动写入|创建时间|
|更新时间|updated_at|DATETIME|是|CURRENT_TIMESTAMP|更新时自动刷新|更新时间|

### 受理信息附件 service_ticket_attachment

|字段名称|字段Key|数据类型|必填|默认值|逻辑规则|说明|
|---|---|---|---|---|---|---|
|附件ID|id|BIGINT|是|-|主键|主键|
|工单ID|ticket_id|BIGINT|是|-|关联售后工单|工单ID|
|文件名称|file_name|VARCHAR(200)|是|-|-|原始文件名|
|文件标题|title|VARCHAR(200)|否|-|可编辑|文件标题|
|文件类型|file_type|VARCHAR(30)|否|-|jpg/png/pdf等|文件类型|
|文件大小|file_size|BIGINT|否|0|单位字节|文件大小|
|文件URL|file_url|VARCHAR(500)|是|-|存储地址|文件URL|
|文件路径|file_path|VARCHAR(500)|否|-|本地/服务器存储可选|文件路径|
|文件分类|file_category|VARCHAR(30)|否|-|受理/维修/支付/物流等|文件分类|
|上传时间|created_at|DATETIME|是|CURRENT_TIMESTAMP|上传时写入|上传时间|
|上传人|created_by|VARCHAR(50)|否|-|-|上传人|
|更新时间|updated_at|DATETIME|是|CURRENT_TIMESTAMP|更新时自动刷新|更新时间|
|更新人|updated_by|VARCHAR(50)|否|-|-|更新人|
|是否删除|is_deleted|TINYINT(1)|是|0|0=未删除，1=已删除|逻辑删除|

### 工单操作日志 service_ticket_operate_log

|字段名称|字段Key|数据类型|必填|默认值|逻辑规则|说明|
|---|---|---|---|---|---|---|
|日志ID|id|BIGINT|是|-|主键|主键|
|工单ID|ticket_id|BIGINT|是|-|关联售后工单|工单ID|
|操作类型|operate_type|VARCHAR(50)|是|-|CREATE / UPDATE / COPY / ATTACH / DELETE 等|操作类型|
|操作字段|field_name|VARCHAR(100)|否|-|字段修改时填写|被修改字段|
|变更前值|before_value|TEXT|否|-|-|修改前值|
|变更后值|after_value|TEXT|否|-|-|修改后值|
|操作人ID|operator_id|BIGINT|否|-|-|操作人ID|
|操作人名称|operator_name|VARCHAR(100)|否|-|-|操作人名称|
|备注|remark|VARCHAR(500)|否|-|-|补充说明|
|创建时间|created_at|DATETIME|是|CURRENT_TIMESTAMP|操作发生时写入|发生时间|


# 4 客户模型

### 客户信息 customer

|字段名称|字段Key|数据类型|必填|默认值|逻辑规则|说明|
|---|---|---|---|---|---|---|
|客户ID|id|BIGINT|是|-|主键|主键|
|客户姓名|customer_name|VARCHAR(100)|是|-|-|客户名称|
|电话号码|phone|VARCHAR(30)|否|-|-|联系方式|
|国家|country|VARCHAR(100)|否|-|-|国家|
|邮箱|email|VARCHAR(100)|否|-|-|邮箱|
|营销同意|marketing_consent|TINYINT(1)|是|0|0=否，1=是|是否同意营销|
|隐私同意|privacy_consent|TINYINT(1)|是|0|0=否，1=是|是否同意隐私协议|
|创建时间|created_at|DATETIME|是|CURRENT_TIMESTAMP|系统自动写入|创建时间|
|更新时间|updated_at|DATETIME|是|CURRENT_TIMESTAMP|更新时自动刷新|更新时间|
|删除标记|is_deleted|TINYINT(1)|是|0|0=未删除，1=已删除|逻辑删除标记|

### 客户地址 customer_address

|字段名称|字段Key|数据类型|必填|默认值|逻辑规则|说明|
|---|---|---|---|---|---|---|
|地址ID|address_id|BIGINT|是|-|主键|主键|
|客户ID|customer_id|BIGINT|是|-|关联客户|客户ID|
|收件人姓名|receiver_name|VARCHAR(100)|否|-|-|收件人|
|地址|address|VARCHAR(255)|是|-|-|地址主文本|
|电话|phone|VARCHAR(30)|否|-|-|固定电话|
|手机号|mobile|VARCHAR(30)|否|-|-|手机号|
|是否默认|is_default|TINYINT(1)|是|0|0=否，1=是|默认地址|
|创建时间|created_at|DATETIME|是|CURRENT_TIMESTAMP|系统自动写入|创建时间|
|更新时间|updated_at|DATETIME|是|CURRENT_TIMESTAMP|更新时自动刷新|更新时间|

### 客户统计 customer_stats

|字段名称|字段Key|数据类型|必填|默认值|逻辑规则|说明|
|---|---|---|---|---|---|---|
|客户ID|customer_id|BIGINT|是|-|关联客户，一客一行|客户ID|
|返修次数|revisit_count|INT|是|0|累计更新|累计返修次数|

### 收货信息 customer_receive

|字段名称|字段Key|数据类型|必填|默认值|逻辑规则|说明|
|---|---|---|---|---|---|---|
|ID|id|BIGINT|是|-|主键|主键|
|工单ID|ticket_id|BIGINT|是|-|关联工单|工单ID|
|收货类型|receive_type|VARCHAR(30)|是|-|门店 / 快递|收货类型|
|收货人|receiver_name|VARCHAR(100)|否|-|-|收货人姓名|
|联系电话|receiver_phone|VARCHAR(30)|否|-|-|收货联系电话|
|收货地址|receive_address|VARCHAR(255)|否|-|快递场景填写|地址信息|
|门店ID|store_id|BIGINT|否|-|门店自提时填写|门店ID|
|物流单号|tracking_no|VARCHAR(50)|否|-|客户寄件场景填写|客户寄件运单号|
|备注|remark|VARCHAR(255)|否|-|-|补充说明|


# 5 咨询模型

### 咨询信息 consultation

|字段名称|字段Key|数据类型|必填|默认值|逻辑规则|说明|
|---|---|---|---|---|---|---|
|咨询ID|id|BIGINT|是|-|主键|主键|
|工单ID|ticket_id|BIGINT|是|-|关联工单|工单ID|
|咨询单号|consult_order_no|VARCHAR(50)|否|-|唯一|咨询业务单号|
|是否需要咨询|need_consult|TINYINT(1)|是|0|0=否，1=是|是否发起咨询|
|咨询类型|consult_type|VARCHAR(50)|否|-|方案确认 / 报价确认 / 他品交换 / 延迟通知等|咨询类型|
|外呼类型|outbound_type|VARCHAR(30)|否|-|咨询类型补充|外呼类型|
|咨询状态|consult_status|VARCHAR(32)|是|-|待发送 / 已发送 / 已回复 / 已关闭等|咨询状态|
|咨询内容|content|TEXT|否|-|-|咨询说明|
|客户回复|customer_response|TEXT|否|-|-|客户回复内容|
|咨询时间|consult_time|DATETIME|否|-|发起咨询时记录|咨询时间|
|回复时间|response_time|DATETIME|否|-|客户回复时记录|回复时间|
|咨询负责人|consult_owner|VARCHAR(50)|否|-|-|咨询负责人|
|异常分类|exception_type|VARCHAR(30)|否|-|异常咨询场景可填写|异常处理类型|
|关联报价ID|quotation_id|BIGINT|否|-|关联报价/支付信息|涉及费用|
|创建时间|created_at|DATETIME|是|CURRENT_TIMESTAMP|系统自动写入|创建时间|
|更新时间|updated_at|DATETIME|是|CURRENT_TIMESTAMP|更新时自动刷新|更新时间|


# 6 产品与库存模型

### 产品信息 product_master

|字段名称|字段Key|数据类型|必填|默认值|逻辑规则|说明|
|---|---|---|---|---|---|---|
|主键ID|id|BIGINT|是|-|主键|系统主键ID|
|产品名称|product_name|VARCHAR(200)|是|-|-|产品名称|
|88码|code_88|VARCHAR(50)|否|-|扫码识别产品|产品88码|
|产品类别|product_category|VARCHAR(100)|否|-|-|产品类别|
|生产工厂1|factory_1|VARCHAR(100)|否|-|-|生产工厂信息1|
|生产工厂2|factory_2|VARCHAR(100)|否|-|-|生产工厂信息2|
|生产工厂3|factory_3|VARCHAR(100)|否|-|-|生产工厂信息3|
|上市日期|launch_date|DATE|否|-|-|产品上市日期|
|零件保有期限|part_retention_period|INT|否|-|单位：年|零件保有期限|
|库存存放位置|stock_location|VARCHAR(200)|否|-|PS手动维护，可作为默认值|默认库存存放位置|
|状态|status|CHAR(1)|是|A|A=启用，I=停用|产品状态|
|备注|remark|VARCHAR(255)|否|-|-|补充说明|
|创建人|created_by|VARCHAR(50)|否|-|-|创建人|
|创建时间|created_at|DATETIME|是|CURRENT_TIMESTAMP|系统自动写入|创建时间|
|更新人|updated_by|VARCHAR(50)|否|-|-|更新人|
|更新时间|updated_at|DATETIME|是|CURRENT_TIMESTAMP|更新时自动刷新|更新时间|
|删除标记|is_deleted|TINYINT(1)|是|0|0=未删除，1=已删除|逻辑删除标记|

### 库存 inventory_stock

|字段名称|字段Key|数据类型|必填|默认值|逻辑规则|说明|
|---|---|---|---|---|---|---|
|主键ID|id|BIGINT|是|-|主键|系统主键ID|
|产品ID|product_id|BIGINT|是|-|关联 `product_master.id`|产品ID|
|库存地点类型|location_type|VARCHAR(30)|是|-|PS、3PL、STORE、REPAIR、FACTORY|库存地点类型|
|库存地点编码|location_code|VARCHAR(50)|是|-|仓库/门店/维修仓编码|库存地点编码|
|库存地点名称|location_name|VARCHAR(100)|否|-|-|库存地点名称|
|可用库存数量|available_qty|INT|是|0|-|当前可用库存数量|
|占用库存数量|reserved_qty|INT|是|0|-|已占用未实际出库数量|
|在途库存数量|in_transit_qty|INT|是|0|-|已发出未入库数量|
|使用中数量|in_use_qty|INT|是|0|可按业务需要保留|已一次性出库或处理中数量|
|冻结库存数量|frozen_qty|INT|是|0|-|冻结库存数量|
|总库存数量|total_qty|INT|是|0|由系统汇总维护|当前总库存数量|
|安全库存阈值|safety_stock_threshold|INT|是|5|低于阈值可预警|安全库存阈值|
|最后同步时间|last_sync_time|DATETIME|否|-|外部系统同步时更新|最近同步时间|
|备注|remark|VARCHAR(255)|否|-|-|补充说明|
|创建人|created_by|VARCHAR(50)|否|-|-|创建人|
|创建时间|created_at|DATETIME|是|CURRENT_TIMESTAMP|系统自动写入|创建时间|
|更新人|updated_by|VARCHAR(50)|否|-|-|更新人|
|更新时间|updated_at|DATETIME|是|CURRENT_TIMESTAMP|更新时自动刷新|更新时间|
|删除标记|is_deleted|TINYINT(1)|是|0|0=未删除，1=已删除|逻辑删除标记|

### 库存交易记录 inventory_transaction

|字段名称|字段Key|数据类型|必填|默认值|逻辑规则|说明|
|---|---|---|---|---|---|---|
|主键ID|id|BIGINT|是|-|主键|系统主键ID|
|交易编号|transaction_no|VARCHAR(50)|是|-|唯一约束|库存流水唯一编号|
|交易类型|transaction_type|VARCHAR(30)|是|-|IN、OUT、TRANSFER、STOCKTAKE、ADJUST、SYNC|库存交易类型|
|业务单号|business_no|VARCHAR(50)|否|-|关联业务单据|业务单号|
|业务来源|business_source|VARCHAR(30)|否|-|PURCHASE、REPAIR、EXCHANGE、STORE、MANUAL、SAP、STOCKTAKE|业务来源|
|关联工单ID|ticket_id|BIGINT|否|-|售后相关时填写|关联工单ID|
|交易时间|transaction_time|DATETIME|是|CURRENT_TIMESTAMP|交易发生时写入|库存交易发生时间|
|产品ID|product_id|BIGINT|是|-|关联 `product_master.id`|产品ID|
|产品名称|product_name|VARCHAR(200)|否|-|冗余保存|交易发生时产品名称|
|88码|code_88|VARCHAR(50)|否|-|冗余保存|交易发生时88码|
|产品类别|product_category|VARCHAR(100)|否|-|冗余保存|交易发生时产品类别|
|库存地点类型|location_type|VARCHAR(30)|否|-|PS、3PL、STORE、FACTORY、REPAIR|库存地点类型|
|来源仓位|from_location|VARCHAR(100)|否|-|出库、调拨时使用|来源仓位|
|目标仓位|to_location|VARCHAR(100)|否|-|入库、调拨时使用|目标仓位|
|交易数量|quantity|INT|是|0|-|本次库存变动数量|
|数量方向|quantity_direction|VARCHAR(10)|是|-|IN=增加，OUT=减少|数量方向|
|库存变动前数量|stock_before|INT|否|-|-|本次交易前库存数量|
|库存变动后数量|stock_after|INT|否|-|-|本次交易后库存数量|
|负责人ID|owner_id|BIGINT|否|-|-|负责人用户ID|
|负责人名称|owner_name|VARCHAR(100)|否|-|-|负责人姓名|
|交易原因|transaction_reason|VARCHAR(100)|否|-|-|库存变动原因|
|备注|remark|VARCHAR(255)|否|-|-|补充说明|
|是否系统生成|is_system_generated|TINYINT(1)|是|0|0=否，1=是|是否系统自动生成|
|是否外部同步生成|external_sync_flag|TINYINT(1)|是|0|0=否，1=是|是否由外部系统同步产生|
|创建人|created_by|VARCHAR(50)|否|-|-|创建人|
|创建时间|created_at|DATETIME|是|CURRENT_TIMESTAMP|系统自动写入|创建时间|
|更新人|updated_by|VARCHAR(50)|否|-|-|更新人|
|更新时间|updated_at|DATETIME|是|CURRENT_TIMESTAMP|更新时自动刷新|更新时间|
|删除标记|is_deleted|TINYINT(1)|是|0|0=未删除，1=已删除|逻辑删除标记|

### 交易类型 transaction_type

|字段名称|字段Key|数据类型|必填|默认值|逻辑规则|说明|
|---|---|---|---|---|---|---|
|交易类型名称|name|VARCHAR(100)|是|-|-|交易类型中文名称|
|交易类型编码|code|VARCHAR(30)|是|-|IN / OUT / TRANSFER / STOCKTAKE / ADJUST / SYNC|交易类型编码|

### 产品库存同步日志表 product_stock_sync_log

|字段名称|字段Key|数据类型|必填|默认值|逻辑规则|说明|
|---|---|---|---|---|---|---|
|主键ID|id|BIGINT|是|-|主键|日志主键|
|产品ID|product_id|BIGINT|是|-|关联产品|产品ID|
|PS数量|ps_quantity|INT|是|0|-|本次同步的PS数量|
|3PL数量|tpl_quantity|INT|是|0|-|本次同步的3PL数量|
|同步时间|sync_time|DATETIME|是|CURRENT_TIMESTAMP|同步时写入|SAP同步时间|
|同步来源|sync_source|VARCHAR(50)|否|SAP|-|数据来源|
|同步状态|sync_status|VARCHAR(20)|是|-|SUCCESS / FAILED|同步状态|
|错误信息|error_message|VARCHAR(500)|否|-|失败时填写|失败原因|


# 7 判定与维修模型

### 检测判定 ticket_judgement

|字段名称|字段Key|数据类型|必填|默认值|逻辑规则|说明|
|---|---|---|---|---|---|---|
|判定ID|id|BIGINT|是|-|主键|主键|
|工单ID|ticket_id|BIGINT|是|-|关联工单|工单ID|
|判定结果|judgement_result|VARCHAR(50)|是|-|有偿/无偿/更换/假货等|判定结果|
|维修类型|repair_type|VARCHAR(50)|否|-|维修 / 换货 / 3PL / 合作厂家|维修类型|
|维修执行方|repair_vendor_type|VARCHAR(30)|否|-|PS / PARTNER / 3PL|维修执行方|
|是否需要支付|is_paid_required|TINYINT(1)|是|0|0=否，1=是|是否要求支付|
|报价金额|quotation_amount|DECIMAL(10,2)|否|0.00|有偿场景填写|报价金额|
|是否需要咨询|need_consult|TINYINT(1)|是|0|0=否，1=是|是否发起咨询|
|判定负责人ID|judgement_owner_id|BIGINT|否|-|-|负责人ID|
|判定负责人名称|judgement_owner_name|VARCHAR(100)|否|-|-|负责人名称|
|判定时间|judgement_date|DATETIME|否|-|判定完成时记录|判定时间|
|备注|remark|TEXT|否|-|-|补充说明|
|创建时间|created_at|DATETIME|是|CURRENT_TIMESTAMP|系统自动写入|创建时间|
|更新时间|updated_at|DATETIME|是|CURRENT_TIMESTAMP|更新时自动刷新|更新时间|

### 维修信息 repair_record

|字段名称|字段Key|数据类型|必填|默认值|逻辑规则|说明|
|---|---|---|---|---|---|---|
|ID|id|BIGINT|是|-|主键|主键|
|工单ID|ticket_id|BIGINT|是|-|关联工单|工单ID|
|入库日期|warehouse_in_date|DATE|否|-|-|进入维修中心时间|
|预计出库日期|expected_out_date|DATE|否|-|-|预计完成时间|
|现象描述|phenomenon|VARCHAR(500)|否|-|-|客户描述|
|问题现象|problem_phenomenon|VARCHAR(30)|否|-|问题分类|问题现象|
|客户请求|repair_request|TEXT|否|-|-|维修诉求|
|镜片类型|lens_type|VARCHAR(30)|否|-|-|镜片类型|
|维修中心|repair_center|VARCHAR(100)|否|-|-|维修单位|
|服务工程师|service_engineer|VARCHAR(100)|否|-|-|负责人|
|维修内容|repair_content|VARCHAR(500)|否|-|-|维修操作|
|维修进度日期|repair_progress_date|DATE|否|-|-|进度时间|
|合作方出库日期|partner_out_date|DATE|否|-|合作厂家/3PL场景填写|合作方发出日期|
|合作方入库日期|partner_in_date|DATE|否|-|合作厂家/3PL场景填写|合作方入库日期|
|再维修原因|re_repair_reason|VARCHAR(255)|否|-|返修场景填写|返修原因|
|是否产品问题|is_product_issue|TINYINT(1)|是|0|0=否，1=是|是否质量问题|
|维修费用类型|repair_cost_type|VARCHAR(30)|否|-|有偿/无偿|维修费用类型|
|维修费用|repair_cost|DECIMAL(10,2)|否|0.00|-|费用金额|
|维修备注|repair_notes|TEXT|否|-|-|补充说明|
|开始维修时间|repair_start_at|DATETIME|否|-|开始维修时记录|实际开始维修时间|
|维修完成时间|repair_finish_at|DATETIME|否|-|维修完成时记录|实际完成时间|
|创建时间|created_at|DATETIME|是|CURRENT_TIMESTAMP|系统自动写入|创建时间|
|更新时间|updated_at|DATETIME|是|CURRENT_TIMESTAMP|更新时自动刷新|更新时间|

### 工单配件 repair_part

|字段名称|字段Key|数据类型|必填|默认值|逻辑规则|说明|
|---|---|---|---|---|---|---|
|ID|id|BIGINT|是|-|主键|主键|
|工单ID|ticket_id|BIGINT|是|-|关联售后工单|工单ID|
|维修记录ID|repair_record_id|BIGINT|否|-|关联维修信息，可为空|维修记录ID|
|配件ID|part_id|BIGINT|是|-|关联配件主数据|配件ID|
|配件名称|part_name|VARCHAR(200)|是|-|冗余存储|便于展示和保留历史|
|配件类型|part_type|VARCHAR(50)|否|-|冗余存储|便于查询|
|数量|quantity|INT|是|1|大于0|本次使用数量|
|单位|unit|VARCHAR(20)|否|-|个/组/片等|单位|
|标准单价|standard_price|DECIMAL(10,2)|否|0.00|来自主数据默认价格|标准单价|
|实际单价|unit_price|DECIMAL(10,2)|否|0.00|-|本次结算单价|
|总价|total_price|DECIMAL(10,2)|否|0.00|数量 × 实际单价|总价|
|是否收费|is_chargeable|TINYINT(1)|是|0|0=否，1=是|是否向客户收费|
|是否更换|is_replaced|TINYINT(1)|是|1|0=否，1=是|是否发生更换|
|备注|remark|TEXT|否|-|-|补充说明|
|创建时间|created_at|DATETIME|是|CURRENT_TIMESTAMP|系统自动写入|创建时间|
|更新时间|updated_at|DATETIME|是|CURRENT_TIMESTAMP|更新时自动刷新|更新时间|

### 工单配件消耗 repair_order_part_usage

|字段名称|字段Key|数据类型|必填|默认值|逻辑规则|说明|
|---|---|---|---|---|---|---|
|明细ID|usage_id|BIGINT|是|-|主键|主键|
|工单ID|repair_order_id|BIGINT|是|-|关联售后工单|工单ID|
|配件ID|part_id|BIGINT|是|-|关联配件主数据|配件ID|
|配件名称|part_name|VARCHAR(200)|否|-|冗余快照|配件名称|
|数量类型|qty_type|VARCHAR(50)|否|-|匹配数量规则时使用|数量类型|
|默认数量|default_qty|INT|否|1|-|系统带出值|
|实际使用数量|actual_qty|INT|是|1|最终确认数量|最终确认数量|
|领用仓位|stock_location|VARCHAR(200)|否|-|扣减库存时记录|配件从哪个仓位扣减|
|执行方|executor_type|VARCHAR(50)|否|-|PS / STORE / THIRD_PARTY|执行方|
|状态|status|VARCHAR(20)|是|DRAFT|DRAFT / CONFIRMED / DEDUCTED|状态|
|创建时间|created_at|DATETIME|是|CURRENT_TIMESTAMP|系统自动写入|创建时间|
|更新时间|updated_at|DATETIME|是|CURRENT_TIMESTAMP|更新时自动刷新|更新时间|


# 8 支付与物流模型

### 支付信息 payment_record

|字段名称|字段Key|数据类型|必填|默认值|逻辑规则|说明|
|---|---|---|---|---|---|---|
|ID|id|BIGINT|是|-|主键|主键|
|工单ID|ticket_id|BIGINT|是|-|关联工单|工单ID|
|支付单号|payment_no|VARCHAR(50)|是|-|唯一|支付业务单号|
|支付状态|payment_status|VARCHAR(32)|是|-|待支付/已支付/失败/取消/超时|支付状态|
|支付金额|amount|DECIMAL(10,2)|是|0.00|大于等于0|金额|
|支付日期|payment_date|DATE|否|-|支付成功时回写|支付日期|
|支付时间|paid_at|DATETIME|否|-|支付成功时回写|支付成功时间|
|支付方式|payment_method|VARCHAR(30)|否|-|微信/支付宝等|支付方式|
|支付授权号|payment_auth_no|VARCHAR(100)|否|-|-|支付流水号|
|第三方交易号|transaction_no|VARCHAR(100)|否|-|-|第三方交易编号|
|最终支付请求|final_payment_request|TINYINT(1)|是|0|0=否，1=是|是否最终确认|
|支付截止日期|payment_deadline|DATE|否|-|超时控制使用|截止时间|
|取消支付|cancel_payment|TINYINT(1)|是|0|0=否，1=是|是否取消|
|SAP同步状态|sap_sync_status|VARCHAR(20)|否|-|待同步/成功/失败|SAP同步状态|
|创建时间|created_at|DATETIME|是|CURRENT_TIMESTAMP|系统自动写入|创建时间|
|更新时间|updated_at|DATETIME|是|CURRENT_TIMESTAMP|更新时自动刷新|更新时间|

### 出库物流 delivery_record

|字段名称|字段Key|数据类型|必填|默认值|逻辑规则|说明|
|---|---|---|---|---|---|---|
|ID|id|BIGINT|是|-|主键|主键|
|工单ID|ticket_id|BIGINT|是|-|关联工单|工单ID|
|出库单号|delivery_no|VARCHAR(50)|否|-|唯一|出库/发货业务单号|
|是否出库完成|out_completed|TINYINT(1)|是|0|0=否，1=是|是否出库完成|
|出库完成日期|out_completed_date|DATE|否|-|出库完成时记录|完成时间|
|配送方式|delivery_type|VARCHAR(30)|否|-|快递/门店自取/3PL发货|配送方式|
|物流商编码|carrier_code|VARCHAR(30)|否|-|-|物流商编码|
|物流商名称|carrier_name|VARCHAR(100)|否|-|-|物流商名称|
|配送状态|delivery_status|VARCHAR(32)|否|-|待发货/运输中/已签收/门店到达/已取件/异常|配送状态|
|配送完成|delivery_completed|TINYINT(1)|是|0|0=否，1=是|是否完成|
|配送日期|delivery_date|DATE|否|-|-|配送时间|
|物流单号|tracking_no|VARCHAR(50)|否|-|快递场景填写|运单号|
|门店提货状态|store_pickup_status|TINYINT(1)|是|0|0=否，1=是|是否提货|
|门店提货日期|store_pickup_date|DATE|否|-|门店提货时记录|提货时间|
|客户签收时间|delivered_at|DATETIME|否|-|快递签收回写|快递签收时间|
|门店到达时间|store_arrived_at|DATETIME|否|-|门店收货时回写|门店到达时间|
|创建时间|created_at|DATETIME|是|CURRENT_TIMESTAMP|系统自动写入|创建时间|
|更新时间|updated_at|DATETIME|是|CURRENT_TIMESTAMP|更新时自动刷新|更新时间|


# 9 配件与配件库存模型

### 配件 part_master

|字段名称|字段Key|数据类型|必填|默认值|逻辑规则|说明|
|---|---|---|---|---|---|---|
|配件ID|part_id|BIGINT|是|-|主键|主键|
|配件名称|part_name|VARCHAR(200)|是|-|-|配件名称|
|配件类型|part_type|VARCHAR(50)|是|-|-|配件类型|
|标准单价|price|DECIMAL(10,2)|是|0.00|大于等于0|标准单价|
|颜色|color|VARCHAR(50)|否|-|-|颜色|
|配件存放位置|part_location|VARCHAR(200)|是|-|PS手动维护|配件存放位置|
|状态|status|VARCHAR(20)|是|ACTIVE|ACTIVE / INACTIVE|状态|

### 配件数量配置 part_qty_config

|字段名称|字段Key|数据类型|必填|默认值|逻辑规则|说明|
|---|---|---|---|---|---|---|
|配置ID|qty_config_id|BIGINT|是|-|主键|主键|
|配件ID|part_id|BIGINT|是|-|关联配件|配件ID|
|数量类型|qty_type|VARCHAR(50)|是|-|REPAIR / STORE / THIRD_PARTY / ETC|数量类型|
|默认数量|qty_value|INT|是|1|大于0|默认带出数量|
|备注|remark|VARCHAR(200)|否|-|-|说明|
|状态|status|VARCHAR(20)|是|ACTIVE|ACTIVE / INACTIVE|启用状态|

### 配件申请 part_request

|字段名称|字段Key|数据类型|必填|默认值|逻辑规则|说明|
|---|---|---|---|---|---|---|
|申请单ID|request_id|BIGINT|是|-|主键|唯一标识|
|申请单号|request_no|VARCHAR(50)|是|-|唯一|业务编号|
|进度状态|status|VARCHAR(30)|是|PENDING_OUTBOUND|创建时自动赋值|状态流转字段|
|请求负责人|requester_account|VARCHAR(50)|是|当前用户|自动带出|创建者账号|
|门店类型|store_type|VARCHAR(50)|是|自动|从用户组织带出|门店类型|
|门店名称|store_name|VARCHAR(100)|是|自动|从用户组织带出|门店/法人/办公室|
|来源工单ID|repair_order_id|BIGINT|否|-|可为空|关联维修单|
|附加请求事项|additional_requirements|TEXT|否|-|-|申请备注|
|创建人|created_by|VARCHAR(50)|是|当前用户|-|系统字段|
|创建时间|created_at|DATETIME|是|CURRENT_TIMESTAMP|系统自动写入|系统字段|
|更新时间|updated_at|DATETIME|是|CURRENT_TIMESTAMP|更新时自动刷新|系统字段|

### 配件申请明细 part_request_item

|字段名称|字段Key|数据类型|必填|默认值|逻辑规则|说明|
|---|---|---|---|---|---|---|
|明细ID|request_item_id|BIGINT|是|-|主键|唯一|
|申请单ID|request_id|BIGINT|是|-|外键|关联主表|
|产品名称|product_name|VARCHAR(200)|条件必填|-|当 `part_type` = HINGE_SCREW / HOOK_SCREW 时必填|产品名称|
|配件ID|part_id|BIGINT|是|-|关联主数据|配件ID|
|配件名称|part_name|VARCHAR(200)|是|-|选择配件后带出|配件名称|
|配件类型|part_type|VARCHAR(50)|是|-|枚举|配件类型|
|颜色|color|VARCHAR(50)|否|-|可带出|颜色|
|配件存放位置|part_location|VARCHAR(200)|是|自动|根据 `part_id` 自动带出|不允许手填|
|数量（组）|request_qty|INT|是|-|必须命中数量规则|下拉选择|
|行备注|item_remark|TEXT|否|-|-|明细备注|

### 配件申请数量规则 part_request_qty_rule

|字段名称|字段Key|数据类型|必填|默认值|逻辑规则|说明|
|---|---|---|---|---|---|---|
|规则ID|rule_id|BIGINT|是|-|主键|主键|
|门店类型|store_type|VARCHAR(50)|是|-|如 FLAGSHIP / OPTICIAN|门店类型|
|可选数量|allowed_qty|INT|是|-|作为下拉枚举值|可选数量|
|状态|status|VARCHAR(20)|是|ACTIVE|ACTIVE / INACTIVE|启用状态|

### 配件库存 part_inventory

|字段名称|字段Key|数据类型|必填|默认值|逻辑规则|说明|
|---|---|---|---|---|---|---|
|库存ID|inventory_id|BIGINT|是|-|主键|主键|
|配件ID|part_id|BIGINT|是|-|关联配件|配件ID|
|存放位置|stock_location|VARCHAR(200)|是|-|-|仓位|
|可用数量|available_qty|INT|是|0|-|当前可用库存|
|冻结数量|frozen_qty|INT|是|0|-|已占用未出库|
|安全库存|safety_stock_qty|INT|是|0|-|预警阈值|
|更新时间|updated_at|DATETIME|是|CURRENT_TIMESTAMP|更新时自动刷新|更新时间|

### 库存申请 inventory_request

|字段名称|字段Key|数据类型|必填|默认值|逻辑规则|说明|
|---|---|---|---|---|---|---|
|ID|id|BIGINT|是|-|主键|主键|
|工单ID|ticket_id|BIGINT|否|-|售后相关时填写|关联售后工单ID|
|产品ID|product_id|BIGINT|是|-|关联产品主数据|产品ID|
|请求时间|request_time|DATETIME|是|CURRENT_TIMESTAMP|发起请求时写入|请求时间|
|进度状态|progress_status|VARCHAR(30)|是|-|-|库存请求当前处理状态|
|请求负责人|request_owner|VARCHAR(50)|否|-|-|发起请求的人员|
|产品编码|product_code|VARCHAR(50)|否|-|-|产品唯一编码|
|产品名称|product_name|VARCHAR(200)|否|-|-|产品名称|
|存放位置|storage_location|VARCHAR(200)|否|-|-|库存存放位置|
|请求数量|request_qty|INT|是|1|大于0|本次请求数量|
|请求原因（大类）|request_reason_main|VARCHAR(30)|否|-|-|请求原因一级分类|
|请求原因（中类）|request_reason_sub|VARCHAR(30)|否|-|-|请求原因二级分类|
|处理时间|process_time|DATETIME|否|-|处理时写入|处理完成或处理动作发生时间|
|处理人|processor|VARCHAR(50)|否|-|-|处理人员|
|创建时间|created_at|DATETIME|是|CURRENT_TIMESTAMP|记录创建时间|创建时间|
|更新时间|updated_at|DATETIME|是|CURRENT_TIMESTAMP|更新时自动刷新|最后更新时间|
|创建人|created_by|VARCHAR(50)|否|-|-|创建人|
|更新人|updated_by|VARCHAR(50)|否|-|-|更新人|
|是否删除|is_deleted|TINYINT(1)|是|0|0=未删除，1=已删除|逻辑删除标识|

### 配件库存流水 part_inventory_log

|字段名称|字段Key|数据类型|必填|默认值|逻辑规则|说明|
|---|---|---|---|---|---|---|
|流水ID|log_id|BIGINT|是|-|主键|主键|
|配件ID|part_id|BIGINT|是|-|关联配件|配件ID|
|工单ID|repair_order_id|BIGINT|否|-|来源工单可为空|来源工单|
|变动类型|change_type|VARCHAR(50)|是|-|OUT / IN / ADJUST|变动类型|
|变动数量|change_qty|INT|是|0|可正可负|变动数量|
|变动前库存|before_qty|INT|否|-|-|变动前|
|变动后库存|after_qty|INT|否|-|-|变动后|
|操作人|operator_id|BIGINT|否|-|-|操作用户|
|操作时间|operated_at|DATETIME|是|CURRENT_TIMESTAMP|操作时写入|操作时间|


# 10 状态机模型

### 状态表 service_status

|字段名称|字段Key|数据类型|必填|默认值|逻辑规则|说明|
|---|---|---|---|---|---|---|
|状态主键ID|id|BIGINT|是|-|主键|主键|
|状态编码|status_key|VARCHAR(64)|是|-|业务状态唯一标识|如 `RECEIVED`、`WAIT_PAYMENT`|
|状态名称|status_name|VARCHAR(100)|是|-|-|状态显示名称|
|状态分类|status_category|VARCHAR(50)|是|-|受理、检查、支付、维修、出库、完成、关闭等|状态所属分类|
|状态说明|description|VARCHAR(500)|否|-|-|业务含义说明|
|是否终态|is_terminal|TINYINT(1)|是|0|0=否，1=是|是否为终态|
|排序号|sort_order|INT|否|0|-|用于状态展示排序|
|是否启用|is_enabled|TINYINT(1)|是|1|0=否，1=是|是否启用|
|创建时间|created_at|DATETIME|是|CURRENT_TIMESTAMP|系统自动写入|记录创建时间|
|更新时间|updated_at|DATETIME|是|CURRENT_TIMESTAMP|更新时自动刷新|记录最后更新时间|

### 状态流转表 service_status_flow

|字段名称|字段Key|数据类型|必填|默认值|逻辑规则|说明|
|---|---|---|---|---|---|---|
|流转主键ID|id|BIGINT|是|-|主键|主键|
|来源状态编码|from_status_key|VARCHAR(64)|是|-|关联 `service_status.status_key`|当前状态|
|目标状态编码|to_status_key|VARCHAR(64)|是|-|关联 `service_status.status_key`|下一状态|
|动作编码|action_key|VARCHAR(64)|是|-|流转动作唯一标识|如 `payment_success`|
|动作名称|action_name|VARCHAR(100)|是|-|-|流转动作名称|
|流转条件说明|condition_desc|VARCHAR(500)|否|-|-|流转成立的业务条件说明|
|是否系统自动|is_system|TINYINT(1)|是|0|0=否，1=是|是否系统自动触发|
|是否启用|is_enabled|TINYINT(1)|是|1|0=否，1=是|是否启用|
|创建时间|created_at|DATETIME|是|CURRENT_TIMESTAMP|系统自动写入|记录创建时间|
|更新时间|updated_at|DATETIME|是|CURRENT_TIMESTAMP|更新时自动刷新|记录最后更新时间|

### 状态流转日志 service_ticket_status_log

|字段名称|字段Key|数据类型|必填|默认值|逻辑规则|说明|
|---|---|---|---|---|---|---|
|日志ID|id|BIGINT|是|-|主键|主键|
|工单ID|ticket_id|BIGINT|是|-|关联 `service_ticket`|工单ID|
|原状态|from_status_key|VARCHAR(64)|是|-|-|变更前状态|
|新状态|to_status_key|VARCHAR(64)|是|-|-|变更后状态|
|触发动作|action_key|VARCHAR(64)|是|-|-|如 `payment_success`|
|动作名称|action_name|VARCHAR(100)|否|-|-|如“支付成功”|
|触发来源|trigger_source|VARCHAR(50)|否|-|USER / ADMIN / SYSTEM / PAYMENT_CALLBACK 等|触发来源|
|操作人ID|operator_id|BIGINT|否|-|-|操作人|
|操作人名称|operator_name|VARCHAR(100)|否|-|-|操作人名称|
|备注|remark|VARCHAR(500)|否|-|-|补充说明|
|扩展数据|extra_data|JSON|否|-|可记录支付金额、物流单号等|上下文数据|
|创建时间|created_at|DATETIME|是|CURRENT_TIMESTAMP|发生时写入|发生时间|


# 11 异常与评价模型

### 异常记录 service_ticket_exception

|字段名称|字段Key|数据类型|必填|默认值|逻辑规则|说明|
|---|---|---|---|---|---|---|
|异常ID|id|BIGINT|是|-|主键|主键|
|工单ID|ticket_id|BIGINT|是|-|关联工单|工单ID|
|异常类型|exception_type|VARCHAR(50)|是|-|支付异常 / 物流异常 / 库存异常 / 咨询异常 / 数据异常等|异常类型|
|异常编码|exception_code|VARCHAR(50)|否|-|-|异常编码|
|异常描述|exception_desc|VARCHAR(500)|否|-|-|异常说明|
|处理状态|status|VARCHAR(30)|是|-|待处理 / 处理中 / 已解决 / 已关闭|处理状态|
|处理人ID|handler_id|BIGINT|否|-|-|处理人|
|处理人名称|handler_name|VARCHAR(100)|否|-|-|处理人名称|
|处理时间|handled_at|DATETIME|否|-|处理完成时写入|处理时间|
|备注|remark|TEXT|否|-|-|补充说明|
|创建时间|created_at|DATETIME|是|CURRENT_TIMESTAMP|系统自动写入|创建时间|
|更新时间|updated_at|DATETIME|是|CURRENT_TIMESTAMP|更新时自动刷新|更新时间|


# 12 满意度问卷 service_ticket_survey

|字段名称|字段Key|数据类型|必填|默认值|逻辑规则|说明|
|---|---|---|---|---|---|---|
|问卷ID|id|BIGINT|是|-|主键|主键|
|工单ID|ticket_id|BIGINT|是|-|关联工单|工单ID|
|工单编号|ticket_no|VARCHAR(50)|是|-|冗余存储便于查询|工单编号|
|问卷题目|survey_title|VARCHAR(200)|是|-|-|问卷题目|
|问卷截止日期|deadline_at|DATETIME|是|-|问卷生成时写入|问卷截止日期|
|问卷状态|survey_status|VARCHAR(30)|是|PENDING|PENDING / SENT / REPLIED / CLOSED|问卷状态|
|维修内容|repair_content|VARCHAR(500)|否|-|冗余保存维修结果摘要|维修内容|
|回访状态|follow_up_status|VARCHAR(30)|是|PENDING|PENDING / COMPLETED / CLOSED|回访状态|
|问卷内容|content|TEXT|否|-|-|客户填写内容|
|评分|score|INT|否|-|建议1-5分|客户评分|
|发送时间|sent_at|DATETIME|否|-|发送问卷时记录|发送时间|
|回复时间|replied_at|DATETIME|否|-|客户提交时记录|回复时间|
|创建时间|created_at|DATETIME|是|CURRENT_TIMESTAMP|系统自动写入|创建时间|
|更新时间|updated_at|DATETIME|是|CURRENT_TIMESTAMP|更新时自动刷新|更新时间|


# 13 通知模型

### 通知模板表 notification_template

|字段名称|字段Key|数据类型|必填|默认值|逻辑规则|说明|
|---|---|---|---|---|---|---|
|模板主键ID|id|BIGINT|是|-|主键|主键|
|模板编码|template_code|VARCHAR(100)|是|-|模板唯一编码|如 `receipt_delivery_complete`|
|模板名称|template_name|VARCHAR(200)|是|-|-|模板名称|
|通知渠道|channel|VARCHAR(20)|是|-|KAKAO / MAIL|通知渠道|
|模板分类|category|VARCHAR(50)|否|-|受理、通知、支付、维修、请求、判定、出库等|模板分类|
|关联状态编码|status_key|VARCHAR(64)|否|-|归属业务状态|关联状态编码|
|模板标题|template_title|VARCHAR(200)|否|-|邮件或通知标题|模板标题|
|模板内容|template_content|TEXT|是|-|支持变量占位符|模板正文内容|
|模板语言|language_code|VARCHAR(20)|否|-|如 `zh-CN`、`ja-JP`、`ko-KR`|模板语言|
|是否启用|is_enabled|TINYINT(1)|是|1|0=否，1=是|是否启用|
|备注|remark|VARCHAR(500)|否|-|-|补充说明|
|创建时间|created_at|DATETIME|是|CURRENT_TIMESTAMP|系统自动写入|记录创建时间|
|更新时间|updated_at|DATETIME|是|CURRENT_TIMESTAMP|更新时自动刷新|记录最后更新时间|

### 模板触发规则表 notification_trigger_rule

|字段名称|字段Key|数据类型|必填|默认值|逻辑规则|说明|
|---|---|---|---|---|---|---|
|规则主键ID|id|BIGINT|是|-|主键|主键|
|触发状态编码|status_key|VARCHAR(64)|是|-|关联业务状态|触发该规则的业务状态|
|触发事件|trigger_event|VARCHAR(64)|是|-|如 `ON_ENTER_STATUS`、`ON_PAYMENT_REMIND_1`、`ON_COMPLETE`|触发时机|
|通知渠道|channel|VARCHAR(20)|是|-|KAKAO / MAIL|通知发送渠道|
|模板编码|template_code|VARCHAR(100)|是|-|关联 `notification_template.template_code`|对应通知模板编码|
|发送条件|send_condition|VARCHAR(500)|否|-|如“返还方式=门店”|发送条件说明|
|接收方类型|receiver_type|VARCHAR(50)|是|-|CUSTOMER / STORE / ADMIN|接收方类型|
|优先级|priority|INT|是|1|数值越小优先级越高|规则优先级|
|是否启用|is_enabled|TINYINT(1)|是|1|0=否，1=是|是否启用|
|备注|remark|VARCHAR(500)|否|-|-|规则补充说明|
|创建时间|created_at|DATETIME|是|CURRENT_TIMESTAMP|系统自动写入|记录创建时间|
|更新时间|updated_at|DATETIME|是|CURRENT_TIMESTAMP|更新时自动刷新|记录最后更新时间|

### 工单通知记录 ticket_notification

|字段名称|字段Key|数据类型|必填|默认值|逻辑规则|说明|
|---|---|---|---|---|---|---|
|通知ID|notification_id|BIGINT|是|-|主键|主键|
|工单ID|ticket_id|BIGINT|是|-|关联工单|工单ID|
|模板编码|template_code|VARCHAR(100)|否|-|对应 `notification_template`|模板编码|
|通知渠道|notify_channel|VARCHAR(30)|是|-|EMAIL / KAKAO_ALIMTALK / MAIL|通知渠道|
|接收人|recipient|VARCHAR(100)|是|-|邮箱 / 手机号|接收人|
|发送内容|content|TEXT|否|-|渲染后内容|发送内容|
|发送状态|send_status|VARCHAR(30)|是|-|成功 / 失败|发送状态|
|发送时间|sent_at|DATETIME|否|-|发送时记录|发送时间|
|触发方式|trigger_type|VARCHAR(30)|否|-|手动 / 自动|触发方式|
|创建时间|created_at|DATETIME|是|CURRENT_TIMESTAMP|系统自动写入|创建时间|

### 通知记录 notification_log

|字段名称|字段Key|数据类型|必填|默认值|逻辑规则|说明|
|---|---|---|---|---|---|---|
|记录ID|id|BIGINT|是|-|主键|主键|
|工单ID|ticket_id|BIGINT|否|-|关联 `service_ticket`|工单ID|
|状态编码|status_key|VARCHAR(64)|否|-|触发时的状态|状态编码|
|触发事件|trigger_event|VARCHAR(64)|是|-|如 `ON_ENTER_STATUS`、`ON_PAYMENT_REMIND_1`|触发事件|
|模板编码|template_code|VARCHAR(100)|否|-|-|对应模板|
|模板名称|template_name|VARCHAR(200)|否|-|冗余存储|模板名称|
|通知渠道|channel|VARCHAR(20)|是|-|KAKAO / MAIL|通知渠道|
|接收人|receiver|VARCHAR(200)|是|-|手机号/邮箱/用户ID|接收人|
|接收人类型|receiver_type|VARCHAR(50)|否|-|CUSTOMER / STORE / ADMIN|接收人类型|
|发送内容|content|TEXT|否|-|已渲染内容|最终发送内容|
|发送状态|send_status|VARCHAR(20)|是|-|SUCCESS / FAILED / PENDING|发送状态|
|失败原因|fail_reason|VARCHAR(500)|否|-|失败时填写|失败原因|
|第三方消息ID|external_msg_id|VARCHAR(100)|否|-|第三方返回ID|第三方消息ID|
|重试次数|retry_count|INT|是|0|-|发送重试次数|
|发送时间|sent_at|DATETIME|否|-|发送时记录|发送时间|
|创建时间|created_at|DATETIME|是|CURRENT_TIMESTAMP|系统自动写入|记录创建时间|


# 14 枚举值模型

### 枚举值管理 sys_enum_item

|字段名称|字段Key|数据类型|必填|默认值|逻辑规则|说明|
|---|---|---|---|---|---|---|
|主键ID|id|BIGINT|是|-|主键|主键|
|枚举类型|enum_type|VARCHAR(50)|是|-|如 STATUS / STORE_TYPE / PART_TYPE / PAYMENT_STATUS|枚举类型|
|枚举编码|enum_code|VARCHAR(50)|是|-|同一枚举类型下唯一|枚举值编码|
|枚举名称|enum_name|VARCHAR(100)|是|-|-|枚举值名称|
|分类|category|VARCHAR(50)|否|-|-|业务分类|
|排序号|sort_order|INT|否|0|-|展示排序|
|是否启用|is_enabled|TINYINT(1)|是|1|0=否，1=是|是否启用|
|备注|remark|VARCHAR(255)|否|-|-|补充说明|
|创建时间|created_at|DATETIME|是|CURRENT_TIMESTAMP|系统自动写入|创建时间|
|更新时间|updated_at|DATETIME|是|CURRENT_TIMESTAMP|更新时自动刷新|更新时间|


# 15 关键关系说明

## 15.1 主链路关系

- `service_ticket` 为核心主表
    
- `service_ticket_item`、`service_ticket_attachment`、`customer_receive`、`ticket_judgement`、`repair_record`、`payment_record`、`delivery_record`、`consultation`、`service_ticket_exception`、`service_ticket_survey`、`service_ticket_status_log` 均通过 `ticket_id` 关联工单
    
- `customer` 与 `customer_address`、`customer_stats` 通过 `customer_id` 关联
    
- `product_master` 与 `inventory_stock`、`inventory_transaction`、`inventory_request` 通过 `product_id` 关联
    
- `part_master` 与 `part_qty_config`、`part_request_item`、`repair_part`、`repair_order_part_usage`、`part_inventory`、`part_inventory_log` 通过 `part_id` 关联
    
- `store` 与 `store_address`、`store_contact` 通过 `store_id` 关联
    
- `service_status_flow` 通过 `from_status_key / to_status_key` 关联 `service_status`
    
- `notification_trigger_rule` 通过 `status_key / template_code` 关联 `service_status` 与 `notification_template`
    

## 15.2 终态定义

以下状态为终态，不允许继续流转：

- `COMPLETED`
    
- `CLOSED_CANCELLED`
    
- `CLOSED_UNPAID_RETURN`
    
- `CLOSED_UNREPAIRABLE`
    
- `CLOSED_FAKE`
    
- `CLOSED_COMPLETED`
    

## 15.3 设计约束

- 所有状态变更必须记录到 `service_ticket_status_log`
    
- 所有关键业务修改记录到 `service_ticket_operate_log`
    
- 所有支付记录以 `payment_record` 为准
    
- 所有通知发送记录以 `notification_log` 为准
    
- 所有配件扣减记录以 `repair_order_part_usage` 与 `part_inventory_log` 为准
    
- 所有库存变动记录以 `inventory_transaction` 与 `part_inventory_log` 为准
    
- 所有异常处理需落表到 `service_ticket_exception`
    
- 所有满意度调查发送与回收需落表到 `service_ticket_survey`
    

