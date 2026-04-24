from django.db import models
from django.utils import timezone


class Ticket(models.Model):
    id = models.BigAutoField(primary_key=True)
    ticket_no = models.CharField(max_length=64)
    source_request_no = models.CharField(max_length=64, null=True, blank=True)
    apply_channel = models.CharField(max_length=32, null=True, blank=True)
    original_ticket_no = models.CharField(max_length=64, null=True, blank=True)
    barcode_no = models.CharField(max_length=64, null=True, blank=True)
    so_no = models.CharField(max_length=64, null=True, blank=True)
    customer = models.ForeignKey('master_data.Customer', on_delete=models.DO_NOTHING, related_name='+', db_index=False, null=True, blank=True)
    store = models.ForeignKey('master_data.Store', on_delete=models.DO_NOTHING, related_name='+', db_index=False, null=True, blank=True)
    product = models.ForeignKey('master_data.Product', on_delete=models.DO_NOTHING, related_name='+', db_index=False, null=True, blank=True)
    main_status_code = models.CharField(max_length=64)
    biz_status_code = models.CharField(max_length=64)
    customer_status_code = models.CharField(max_length=64, null=True, blank=True)
    current_payment_status = models.CharField(max_length=64, null=True, blank=True)
    current_repair_status = models.CharField(max_length=64, null=True, blank=True)
    current_fulfillment_status = models.CharField(max_length=64, null=True, blank=True)
    judge_owner = models.ForeignKey('master_data.SysUser', on_delete=models.DO_NOTHING, related_name='+', db_index=False, null=True, blank=True)
    service_engineer = models.ForeignKey('master_data.SysUser', on_delete=models.DO_NOTHING, related_name='+', db_index=False, null=True, blank=True)
    last_action_code = models.CharField(max_length=64, null=True, blank=True)
    last_action_at = models.DateTimeField(null=True, blank=True)
    last_action_by = models.ForeignKey('master_data.SysUser', on_delete=models.DO_NOTHING, related_name='+', db_index=False, db_column='last_action_by', null=True, blank=True)
    service_completed_at = models.DateTimeField(null=True, blank=True)
    closed_at = models.DateTimeField(null=True, blank=True)
    version_no = models.IntegerField(default=1)
    created_by = models.ForeignKey('master_data.SysUser', on_delete=models.DO_NOTHING, related_name='+', db_index=False, db_column='created_by', null=True, blank=True)
    updated_by = models.ForeignKey('master_data.SysUser', on_delete=models.DO_NOTHING, related_name='+', db_index=False, db_column='updated_by', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_deleted = models.SmallIntegerField(default=0)

    class Meta:
        db_table = 'ticket'
        constraints = [
            models.UniqueConstraint(fields=['ticket_no'], name='uk_ticket_no'),
            models.UniqueConstraint(fields=['barcode_no'], name='uk_barcode_no'),
            models.UniqueConstraint(fields=['source_request_no'], name='uk_source_request_no'),
        ]
        indexes = [
            models.Index(fields=['main_status_code', 'biz_status_code', 'created_at'], name='idx_ticket_status_created'),
            models.Index(fields=['customer', 'created_at'], name='idx_ticket_customer_created'),
            models.Index(fields=['judge_owner', 'biz_status_code'], name='idx_ticket_judge_status'),
            models.Index(fields=['service_engineer', 'biz_status_code'], name='idx_ticket_engineer_status'),
            models.Index(fields=['source_request_no'], name='idx_ticket_source_request_no'),
        ]
        verbose_name = 'ticket'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class TicketSnapshot(models.Model):
    id = models.BigAutoField(primary_key=True)
    ticket = models.ForeignKey('Ticket', on_delete=models.DO_NOTHING, related_name='+', db_index=False)
    customer_name = models.CharField(max_length=100)
    customer_phone = models.CharField(max_length=32)
    customer_email = models.CharField(max_length=100, null=True, blank=True)
    country_code = models.CharField(max_length=50, null=True, blank=True)
    receive_type = models.CharField(max_length=32, null=True, blank=True)
    receive_address = models.CharField(max_length=255, null=True, blank=True)
    receive_channel_type = models.CharField(max_length=64, null=True, blank=True)
    receive_channel = models.CharField(max_length=100, null=True, blank=True)
    receive_store_code = models.CharField(max_length=64, null=True, blank=True)
    receive_store_name = models.CharField(max_length=100, null=True, blank=True)
    purchase_date = models.DateField(null=True, blank=True)
    purchase_channel = models.CharField(max_length=100, null=True, blank=True)
    customer_request = models.TextField(null=True, blank=True)
    product_code = models.CharField(max_length=64, null=True, blank=True)
    product_name = models.CharField(max_length=200, null=True, blank=True)
    product_category = models.CharField(max_length=64, null=True, blank=True)
    selected_factory_code = models.CharField(max_length=64, null=True, blank=True)
    selected_factory_name = models.CharField(max_length=100, null=True, blank=True)
    part_code = models.CharField(max_length=64, null=True, blank=True)
    part_name = models.CharField(max_length=200, null=True, blank=True)
    part_location = models.CharField(max_length=100, null=True, blank=True)
    has_purchase_proof = models.SmallIntegerField(default=0)
    has_accessories = models.SmallIntegerField(default=0)
    has_warranty_card = models.SmallIntegerField(default=0)
    accessory_types_json = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'ticket_snapshot'
        constraints = [
            models.UniqueConstraint(fields=['ticket'], name='uk_ticket_snapshot_ticket_id'),
        ]
        verbose_name = 'ticket_snapshot'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class TicketRepair(models.Model):
    id = models.BigAutoField(primary_key=True)
    ticket = models.ForeignKey('Ticket', on_delete=models.DO_NOTHING, related_name='+', db_index=False)
    hq_inbound_date = models.DateTimeField(null=True, blank=True)
    expected_outbound_date = models.DateField(null=True, blank=True)
    expected_completion_date = models.DateField(null=True, blank=True)
    transfer_hq_date = models.DateField(null=True, blank=True)
    hq_return_signed_date = models.DateField(null=True, blank=True)
    phenomenon = models.CharField(max_length=100, null=True, blank=True)
    issue_phenomenon = models.CharField(max_length=100, null=True, blank=True)
    lens_type = models.CharField(max_length=64, null=True, blank=True)
    repair_location = models.CharField(max_length=100, null=True, blank=True)
    repair_type = models.CharField(max_length=64, null=True, blank=True)
    repair_content = models.CharField(max_length=64, null=True, blank=True)
    selected_factory_code = models.CharField(max_length=64, null=True, blank=True)
    selected_factory_name = models.CharField(max_length=100, null=True, blank=True)
    replacement_product_code = models.CharField(max_length=64, null=True, blank=True)
    replacement_product_name = models.CharField(max_length=200, null=True, blank=True)
    repair_again_reason = models.CharField(max_length=100, null=True, blank=True)
    is_product_issue = models.SmallIntegerField(default=0)
    repair_fee_type = models.CharField(max_length=32, null=True, blank=True)
    repair_fee_percent = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    base_price_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    repair_fee_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    currency_code = models.CharField(max_length=16, null=True, blank=True)
    repair_reference_note = models.TextField(null=True, blank=True)
    repair_started_at = models.DateTimeField(null=True, blank=True)
    repair_completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'ticket_repair'
        constraints = [
            models.UniqueConstraint(fields=['ticket'], name='uk_ticket_repair_ticket_id'),
        ]
        verbose_name = 'ticket_repair'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class TicketPayment(models.Model):
    id = models.BigAutoField(primary_key=True)
    ticket = models.ForeignKey('Ticket', on_delete=models.DO_NOTHING, related_name='+', db_index=False)
    payment_order_no = models.CharField(max_length=64)
    payment_status = models.CharField(max_length=64)
    payment_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    payment_method = models.CharField(max_length=50, null=True, blank=True)
    payment_auth_no = models.CharField(max_length=100, null=True, blank=True)
    payment_txn_no = models.CharField(max_length=100, null=True, blank=True)
    final_payment_request_no = models.CharField(max_length=100, null=True, blank=True)
    sign_verified = models.SmallIntegerField(default=0)
    last_callback_at = models.DateTimeField(null=True, blank=True)
    last_compensation_at = models.DateTimeField(null=True, blank=True)
    last_compensation_result = models.CharField(max_length=32, null=True, blank=True)
    quoted_at = models.DateTimeField(null=True, blank=True)
    payable_start_at = models.DateTimeField(null=True, blank=True)
    payment_deadline = models.DateField(null=True, blank=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    payment_link = models.CharField(max_length=500, null=True, blank=True)
    is_payment_cancelled = models.SmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'ticket_payment'
        constraints = [
            models.UniqueConstraint(fields=['payment_order_no'], name='uk_ticket_payment_payment_order_no'),
        ]
        indexes = [
            models.Index(fields=['ticket', 'payment_status'], name='idx_ticket_payment_ticket_status'),
            models.Index(fields=['payment_status', 'payment_deadline'], name='idx_ticket_payment_status_deadline'),
            models.Index(fields=['payment_txn_no'], name='idx_ticket_payment_txn_no'),
        ]
        verbose_name = 'ticket_payment'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class TicketPaymentEventLog(models.Model):
    id = models.BigAutoField(primary_key=True)
    ticket_payment = models.ForeignKey('TicketPayment', on_delete=models.DO_NOTHING, related_name='+', db_index=False)
    ticket = models.ForeignKey('Ticket', on_delete=models.DO_NOTHING, related_name='+', db_index=False)
    event_type = models.CharField(max_length=32)
    event_source = models.CharField(max_length=32, null=True, blank=True)
    event_result = models.CharField(max_length=32, null=True, blank=True)
    payment_result = models.CharField(max_length=32, null=True, blank=True)
    payment_status = models.CharField(max_length=64, null=True, blank=True)
    request_payload = models.TextField(null=True, blank=True)
    response_payload = models.TextField(null=True, blank=True)
    raw_payload = models.TextField(null=True, blank=True)
    event_time = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'ticket_payment_event_log'
        indexes = [
            models.Index(fields=['ticket_payment', 'event_time'], name='idx_ticket_payment_event_log_payment_time'),
            models.Index(fields=['ticket', 'event_type', 'event_time'], name='idx_ticket_payment_event_log_ticket_type_time'),
        ]
        verbose_name = 'ticket_payment_event_log'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class TicketRefund(models.Model):
    id = models.BigAutoField(primary_key=True)
    ticket = models.ForeignKey('Ticket', on_delete=models.DO_NOTHING, related_name='+', db_index=False)
    ticket_payment = models.ForeignKey('TicketPayment', on_delete=models.DO_NOTHING, related_name='+', db_index=False)
    refund_no = models.CharField(max_length=64)
    refund_status = models.CharField(max_length=64)
    refund_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    refund_time = models.DateTimeField(null=True, blank=True)
    refund_result = models.CharField(max_length=100, null=True, blank=True)
    refund_reason = models.TextField(null=True, blank=True)
    operator = models.ForeignKey('master_data.SysUser', on_delete=models.DO_NOTHING, related_name='+', db_index=False, null=True, blank=True)
    remark = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'ticket_refund'
        constraints = [
            models.UniqueConstraint(fields=['refund_no'], name='uk_ticket_refund_refund_no'),
        ]
        indexes = [
            models.Index(fields=['ticket'], name='idx_ticket_refund_ticket_id'),
            models.Index(fields=['ticket_payment'], name='idx_ticket_refund_ticket_payment_id'),
            models.Index(fields=['refund_status'], name='idx_ticket_refund_status'),
        ]
        verbose_name = 'ticket_refund'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class TicketFulfillment(models.Model):
    id = models.BigAutoField(primary_key=True)
    ticket = models.ForeignKey('Ticket', on_delete=models.DO_NOTHING, related_name='+', db_index=False)
    delivery_method = models.CharField(max_length=32, null=True, blank=True)
    delivery_status = models.CharField(max_length=64, null=True, blank=True)
    carrier_name = models.CharField(max_length=100, null=True, blank=True)
    tracking_no = models.CharField(max_length=100, null=True, blank=True)
    outbound_ready_at = models.DateTimeField(null=True, blank=True)
    outbound_completed_at = models.DateTimeField(null=True, blank=True)
    delivery_started_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    signed_at = models.DateTimeField(null=True, blank=True)
    store_arrived_at = models.DateTimeField(null=True, blank=True)
    store_received_at = models.DateTimeField(null=True, blank=True)
    customer_picked_at = models.DateTimeField(null=True, blank=True)
    visible_remark_3pl = models.TextField(null=True, blank=True)
    remark = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'ticket_fulfillment'
        constraints = [
            models.UniqueConstraint(fields=['ticket'], name='uk_ticket_fulfillment_ticket_id'),
        ]
        indexes = [
            models.Index(fields=['delivery_status', 'tracking_no'], name='idx_ticket_fulfillment_status_tracking'),
        ]
        verbose_name = 'ticket_fulfillment'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class TicketInboundLogistics(models.Model):
    id = models.BigAutoField(primary_key=True)
    ticket = models.ForeignKey('Ticket', on_delete=models.DO_NOTHING, related_name='+', db_index=False)
    customer_phone = models.CharField(max_length=32, null=True, blank=True)
    carrier_name = models.CharField(max_length=100, null=True, blank=True)
    tracking_no = models.CharField(max_length=100, null=True, blank=True)
    shipped_at = models.DateTimeField(null=True, blank=True)
    remark = models.TextField(null=True, blank=True)
    submit_source = models.CharField(max_length=32, null=True, blank=True)
    shipping_info_status = models.CharField(max_length=32, default='PENDING')
    submitted_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'ticket_inbound_logistics'
        constraints = [
            models.UniqueConstraint(fields=['ticket'], name='uk_ticket_inbound_logistics_ticket_id'),
        ]
        indexes = [
            models.Index(fields=['tracking_no'], name='idx_ticket_inbound_logistics_tracking_no'),
            models.Index(fields=['customer_phone', 'submitted_at'], name='idx_ticket_inbound_logistics_phone_submitted'),
        ]
        verbose_name = 'ticket_inbound_logistics'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class TicketConsultation(models.Model):
    id = models.BigAutoField(primary_key=True)
    ticket = models.ForeignKey('Ticket', on_delete=models.DO_NOTHING, related_name='+', db_index=False)
    consultation_no = models.CharField(max_length=64)
    item_type = models.CharField(max_length=32)
    outbound_type = models.CharField(max_length=64, null=True, blank=True)
    consultation_channel = models.CharField(max_length=64, null=True, blank=True)
    consultation_category = models.CharField(max_length=64, null=True, blank=True)
    consultation_demand_category = models.CharField(max_length=64, null=True, blank=True)
    subject = models.CharField(max_length=200, null=True, blank=True)
    content = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=64)
    need_customer_confirm = models.SmallIntegerField(default=0)
    customer_confirm_result = models.CharField(max_length=64, null=True, blank=True)
    confirm_source = models.CharField(max_length=32, null=True, blank=True)
    launched_at = models.DateTimeField(null=True, blank=True)
    confirm_deadline = models.DateTimeField(null=True, blank=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    owner = models.ForeignKey('master_data.SysUser', on_delete=models.DO_NOTHING, related_name='+', db_index=False, null=True, blank=True)
    confirm_payload_json = models.TextField(null=True, blank=True)
    confirm_notice_count = models.IntegerField(default=0)
    last_contact_record = models.TextField(null=True, blank=True)
    need_manual_follow_up = models.SmallIntegerField(default=0)
    follow_up_result = models.TextField(null=True, blank=True)
    is_timeout = models.SmallIntegerField(default=0)
    timeout_at = models.DateTimeField(null=True, blank=True)
    process_result = models.TextField(null=True, blank=True)
    is_blocking_main_flow = models.SmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'ticket_consultation'
        constraints = [
            models.UniqueConstraint(fields=['consultation_no'], name='uk_ticket_consultation_consultation_no'),
        ]
        indexes = [
            models.Index(fields=['ticket', 'status'], name='idx_ticket_consultation_ticket_status'),
            models.Index(fields=['owner', 'status', 'launched_at'], name='idx_ticket_consultation_owner_status'),
        ]
        verbose_name = 'ticket_consultation'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class TicketCancelLog(models.Model):
    id = models.BigAutoField(primary_key=True)
    ticket = models.ForeignKey('Ticket', on_delete=models.DO_NOTHING, related_name='+', db_index=False)
    cancel_source = models.CharField(max_length=32)
    cancel_reason = models.CharField(max_length=200, null=True, blank=True)
    cancel_remark = models.TextField(null=True, blank=True)
    apply_time = models.DateTimeField(null=True, blank=True)
    cancel_result = models.CharField(max_length=32)
    result_reason = models.TextField(null=True, blank=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    processed_by = models.ForeignKey('master_data.SysUser', on_delete=models.DO_NOTHING, related_name='+', db_index=False, db_column='processed_by', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'ticket_cancel_log'
        indexes = [
            models.Index(fields=['ticket', 'created_at'], name='idx_ticket_cancel_log_ticket_created'),
            models.Index(fields=['cancel_source', 'apply_time'], name='idx_ticket_cancel_log_source_apply'),
        ]
        verbose_name = 'ticket_cancel_log'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class TicketConsultationAttachment(models.Model):
    id = models.BigAutoField(primary_key=True)
    consultation = models.ForeignKey('TicketConsultation', on_delete=models.DO_NOTHING, related_name='+', db_index=False)
    attachment_type = models.CharField(max_length=32)
    file_name = models.CharField(max_length=255, null=True, blank=True)
    file_url = models.CharField(max_length=500)
    sort_no = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'ticket_consultation_attachment'
        indexes = [
            models.Index(fields=['consultation'], name='idx_ticket_consultation_attachment_consultation_id'),
        ]
        verbose_name = 'ticket_consultation_attachment'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class TicketAttachment(models.Model):
    id = models.BigAutoField(primary_key=True)
    ticket = models.ForeignKey('Ticket', on_delete=models.DO_NOTHING, related_name='+', db_index=False)
    file_name = models.CharField(max_length=255)
    title = models.CharField(max_length=200, null=True, blank=True)
    file_type = models.CharField(max_length=50, null=True, blank=True)
    file_size = models.BigIntegerField(null=True, blank=True)
    file_url = models.CharField(max_length=500)
    uploaded_by = models.ForeignKey('master_data.SysUser', on_delete=models.DO_NOTHING, related_name='+', db_index=False, db_column='uploaded_by', null=True, blank=True)
    uploaded_at = models.DateTimeField(default=timezone.now)
    updated_by = models.ForeignKey('master_data.SysUser', on_delete=models.DO_NOTHING, related_name='+', db_index=False, db_column='updated_by', null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'ticket_attachment'
        indexes = [
            models.Index(fields=['ticket', 'uploaded_at'], name='idx_ticket_attachment_ticket_id_uploaded_at'),
        ]
        verbose_name = 'ticket_attachment'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class TicketProgress(models.Model):
    id = models.BigAutoField(primary_key=True)
    ticket = models.ForeignKey('Ticket', on_delete=models.DO_NOTHING, related_name='+', db_index=False)
    progress_time = models.DateTimeField()
    progress_type = models.CharField(max_length=64)
    progress_title = models.CharField(max_length=200, null=True, blank=True)
    progress_content = models.TextField(null=True, blank=True)
    source_type = models.CharField(max_length=32)
    is_customer_visible = models.SmallIntegerField(default=1)
    created_by = models.ForeignKey('master_data.SysUser', on_delete=models.DO_NOTHING, related_name='+', db_index=False, db_column='created_by', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'ticket_progress'
        indexes = [
            models.Index(fields=['ticket', 'progress_time'], name='idx_ticket_progress_ticket_time'),
            models.Index(fields=['ticket', 'is_customer_visible'], name='idx_ticket_progress_ticket_visible'),
        ]
        verbose_name = 'ticket_progress'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class TicketStatusLog(models.Model):
    id = models.BigAutoField(primary_key=True)
    ticket = models.ForeignKey('Ticket', on_delete=models.DO_NOTHING, related_name='+', db_index=False)
    from_status_code = models.CharField(max_length=64, null=True, blank=True)
    action_code = models.CharField(max_length=64)
    to_status_code = models.CharField(max_length=64)
    trigger_type = models.CharField(max_length=32)
    operator = models.ForeignKey('master_data.SysUser', on_delete=models.DO_NOTHING, related_name='+', db_index=False, null=True, blank=True)
    operator_role_code = models.CharField(max_length=64, null=True, blank=True)
    trigger_source = models.CharField(max_length=100, null=True, blank=True)
    remark = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'ticket_status_log'
        indexes = [
            models.Index(fields=['ticket', 'created_at'], name='idx_ticket_status_log_ticket_created'),
            models.Index(fields=['action_code', 'created_at'], name='idx_ticket_status_log_action_created'),
        ]
        verbose_name = 'ticket_status_log'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class TicketActionLog(models.Model):
    id = models.BigAutoField(primary_key=True)
    ticket = models.ForeignKey('Ticket', on_delete=models.DO_NOTHING, related_name='+', db_index=False)
    action_code = models.CharField(max_length=64)
    action_name = models.CharField(max_length=100, null=True, blank=True)
    execute_result = models.CharField(max_length=32)
    fail_reason = models.TextField(null=True, blank=True)
    request_payload = models.JSONField(null=True, blank=True)
    operator = models.ForeignKey('master_data.SysUser', on_delete=models.DO_NOTHING, related_name='+', db_index=False, null=True, blank=True)
    executed_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'ticket_action_log'
        indexes = [
            models.Index(fields=['ticket', 'executed_at'], name='idx_ticket_action_log_ticket_executed'),
            models.Index(fields=['action_code', 'execute_result'], name='idx_ticket_action_log_action_result'),
        ]
        verbose_name = 'ticket_action_log'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class TicketException(models.Model):
    id = models.BigAutoField(primary_key=True)
    ticket = models.ForeignKey('Ticket', on_delete=models.DO_NOTHING, related_name='+', db_index=False)
    exception_type = models.CharField(max_length=64)
    exception_code = models.CharField(max_length=64, null=True, blank=True)
    exception_status = models.CharField(max_length=32)
    exception_content = models.TextField(null=True, blank=True)
    owner = models.ForeignKey('master_data.SysUser', on_delete=models.DO_NOTHING, related_name='+', db_index=False, null=True, blank=True)
    process_result = models.TextField(null=True, blank=True)
    occurred_at = models.DateTimeField(default=timezone.now)
    resolved_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'ticket_exception'
        indexes = [
            models.Index(fields=['ticket', 'occurred_at'], name='idx_ticket_exception_ticket_occurred'),
            models.Index(fields=['exception_status', 'owner'], name='idx_ticket_exception_status_owner'),
        ]
        verbose_name = 'ticket_exception'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class TicketAvailableAction(models.Model):
    id = models.BigAutoField(primary_key=True)
    ticket = models.ForeignKey('Ticket', on_delete=models.DO_NOTHING, related_name='+', db_index=False)
    action_code = models.CharField(max_length=64)
    action_name = models.CharField(max_length=100, null=True, blank=True)
    source_status_code = models.CharField(max_length=64)
    is_enabled = models.SmallIntegerField(default=1)
    disabled_reason = models.CharField(max_length=255, null=True, blank=True)
    generated_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'ticket_available_action'
        constraints = [
            models.UniqueConstraint(fields=['ticket', 'action_code'], name='uk_ticket_available_action_ticket_action'),
        ]
        indexes = [
            models.Index(fields=['ticket', 'is_enabled'], name='idx_ticket_available_action_ticket_enabled'),
        ]
        verbose_name = 'ticket_available_action'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)
