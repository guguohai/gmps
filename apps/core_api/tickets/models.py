from django.db import models

class Ticket(models.Model):
    ticket_no = models.CharField(max_length=64, verbose_name='ticket_no')
    source_request_no = models.CharField(max_length=64, verbose_name='source_request_no', null=True, blank=True)
    apply_channel = models.CharField(max_length=32, verbose_name='apply_channel', null=True, blank=True)
    original_ticket_no = models.CharField(max_length=64, verbose_name='original_ticket_no', null=True, blank=True)
    barcode_no = models.CharField(max_length=64, verbose_name='barcode_no', null=True, blank=True)
    so_no = models.CharField(max_length=64, verbose_name='so_no', null=True, blank=True)
    customer = models.ForeignKey('master_data.Customer', on_delete=models.SET_NULL if True else models.CASCADE, verbose_name='customer_id', null=True, blank=True)
    store = models.ForeignKey('master_data.Store', on_delete=models.SET_NULL if True else models.CASCADE, verbose_name='store_id', null=True, blank=True)
    product = models.ForeignKey('master_data.Product', on_delete=models.SET_NULL if True else models.CASCADE, verbose_name='product_id', null=True, blank=True)
    main_status_code = models.CharField(max_length=64, verbose_name='main_status_code')
    biz_status_code = models.CharField(max_length=64, verbose_name='biz_status_code')
    customer_status_code = models.CharField(max_length=64, verbose_name='customer_status_code', null=True, blank=True)
    current_payment_status = models.CharField(max_length=64, verbose_name='current_payment_status', null=True, blank=True)
    current_repair_status = models.CharField(max_length=64, verbose_name='current_repair_status', null=True, blank=True)
    current_fulfillment_status = models.CharField(max_length=64, verbose_name='current_fulfillment_status', null=True, blank=True)
    judge_owner = models.ForeignKey('master_data.SysUser', on_delete=models.SET_NULL if True else models.CASCADE, verbose_name='judge_owner_id', null=True, blank=True)
    service_engineer = models.ForeignKey('master_data.SysUser', on_delete=models.SET_NULL if True else models.CASCADE, verbose_name='service_engineer_id', null=True, blank=True)
    last_action_code = models.CharField(max_length=64, verbose_name='last_action_code', null=True, blank=True)
    last_action_at = models.DateTimeField(verbose_name='last_action_at', null=True, blank=True)
    last_action_by = models.BigIntegerField(verbose_name='last_action_by', null=True, blank=True)
    service_completed_at = models.DateTimeField(verbose_name='service_completed_at', null=True, blank=True)
    closed_at = models.DateTimeField(verbose_name='closed_at', null=True, blank=True)
    version_no = models.IntegerField(verbose_name='version_no', default=1)
    created_by = models.BigIntegerField(verbose_name='created_by', null=True, blank=True)
    updated_by = models.BigIntegerField(verbose_name='updated_by', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='created_at')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='updated_at')
    is_deleted = models.SmallIntegerField(verbose_name='is_deleted', default=0)

    class Meta:
        db_table = 'ticket'
        verbose_name = 'ticket'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class TicketSnapshot(models.Model):
    ticket = models.ForeignKey('Ticket', on_delete=models.SET_NULL if False else models.CASCADE, verbose_name='ticket_id')
    customer_name = models.CharField(max_length=100, verbose_name='customer_name')
    customer_phone = models.CharField(max_length=32, verbose_name='customer_phone')
    customer_email = models.CharField(max_length=100, verbose_name='customer_email', null=True, blank=True)
    country_code = models.CharField(max_length=50, verbose_name='country_code', null=True, blank=True)
    receive_type = models.CharField(max_length=32, verbose_name='receive_type', null=True, blank=True)
    receive_address = models.CharField(max_length=255, verbose_name='receive_address', null=True, blank=True)
    receive_channel_type = models.CharField(max_length=64, verbose_name='receive_channel_type', null=True, blank=True)
    receive_channel = models.CharField(max_length=100, verbose_name='receive_channel', null=True, blank=True)
    receive_store_code = models.CharField(max_length=64, verbose_name='receive_store_code', null=True, blank=True)
    receive_store_name = models.CharField(max_length=100, verbose_name='receive_store_name', null=True, blank=True)
    purchase_date = models.DateField(verbose_name='purchase_date', null=True, blank=True)
    purchase_channel = models.CharField(max_length=100, verbose_name='purchase_channel', null=True, blank=True)
    customer_request = models.TextField(verbose_name='customer_request', null=True, blank=True)
    product_code = models.CharField(max_length=64, verbose_name='product_code', null=True, blank=True)
    product_name = models.CharField(max_length=200, verbose_name='product_name', null=True, blank=True)
    product_category = models.CharField(max_length=64, verbose_name='product_category', null=True, blank=True)
    selected_factory_code = models.CharField(max_length=64, verbose_name='selected_factory_code', null=True, blank=True)
    selected_factory_name = models.CharField(max_length=100, verbose_name='selected_factory_name', null=True, blank=True)
    part_code = models.CharField(max_length=64, verbose_name='part_code', null=True, blank=True)
    part_name = models.CharField(max_length=200, verbose_name='part_name', null=True, blank=True)
    part_location = models.CharField(max_length=100, verbose_name='part_location', null=True, blank=True)
    has_purchase_proof = models.SmallIntegerField(verbose_name='has_purchase_proof', default=0)
    has_accessories = models.SmallIntegerField(verbose_name='has_accessories', default=0)
    has_warranty_card = models.SmallIntegerField(verbose_name='has_warranty_card', default=0)
    accessory_types_json = models.JSONField(verbose_name='accessory_types_json', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='created_at')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='updated_at')

    class Meta:
        db_table = 'ticket_snapshot'
        verbose_name = 'ticket_snapshot'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class TicketRepair(models.Model):
    ticket = models.ForeignKey('Ticket', on_delete=models.SET_NULL if False else models.CASCADE, verbose_name='ticket_id')
    hq_inbound_date = models.DateTimeField(verbose_name='hq_inbound_date', null=True, blank=True)
    expected_outbound_date = models.DateField(verbose_name='expected_outbound_date', null=True, blank=True)
    expected_completion_date = models.DateField(verbose_name='expected_completion_date', null=True, blank=True)
    transfer_hq_date = models.DateField(verbose_name='transfer_hq_date', null=True, blank=True)
    hq_return_signed_date = models.DateField(verbose_name='hq_return_signed_date', null=True, blank=True)
    phenomenon = models.CharField(max_length=100, verbose_name='phenomenon', null=True, blank=True)
    issue_phenomenon = models.CharField(max_length=100, verbose_name='issue_phenomenon', null=True, blank=True)
    lens_type = models.CharField(max_length=64, verbose_name='lens_type', null=True, blank=True)
    repair_location = models.CharField(max_length=100, verbose_name='repair_location', null=True, blank=True)
    repair_type = models.CharField(max_length=64, verbose_name='repair_type', null=True, blank=True)
    repair_content = models.CharField(max_length=64, verbose_name='repair_content', null=True, blank=True)
    selected_factory_code = models.CharField(max_length=64, verbose_name='selected_factory_code', null=True, blank=True)
    selected_factory_name = models.CharField(max_length=100, verbose_name='selected_factory_name', null=True, blank=True)
    replacement_product_code = models.CharField(max_length=64, verbose_name='replacement_product_code', null=True, blank=True)
    replacement_product_name = models.CharField(max_length=200, verbose_name='replacement_product_name', null=True, blank=True)
    repair_again_reason = models.CharField(max_length=100, verbose_name='repair_again_reason', null=True, blank=True)
    is_product_issue = models.SmallIntegerField(verbose_name='is_product_issue', default=0)
    repair_fee_type = models.CharField(max_length=32, verbose_name='repair_fee_type', null=True, blank=True)
    repair_fee_percent = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='repair_fee_percent', null=True, blank=True)
    base_price_amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='base_price_amount', null=True, blank=True)
    repair_fee_amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='repair_fee_amount', null=True, blank=True)
    currency_code = models.CharField(max_length=16, verbose_name='currency_code', null=True, blank=True)
    repair_reference_note = models.TextField(verbose_name='repair_reference_note', null=True, blank=True)
    repair_started_at = models.DateTimeField(verbose_name='repair_started_at', null=True, blank=True)
    repair_completed_at = models.DateTimeField(verbose_name='repair_completed_at', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='created_at')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='updated_at')

    class Meta:
        db_table = 'ticket_repair'
        verbose_name = 'ticket_repair'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class TicketPayment(models.Model):
    ticket = models.ForeignKey('Ticket', on_delete=models.SET_NULL if False else models.CASCADE, verbose_name='ticket_id')
    payment_order_no = models.CharField(max_length=64, verbose_name='payment_order_no')
    payment_status = models.CharField(max_length=64, verbose_name='payment_status')
    payment_amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='payment_amount', null=True, blank=True)
    payment_method = models.CharField(max_length=50, verbose_name='payment_method', null=True, blank=True)
    payment_auth_no = models.CharField(max_length=100, verbose_name='payment_auth_no', null=True, blank=True)
    payment_txn_no = models.CharField(max_length=100, verbose_name='payment_txn_no', null=True, blank=True)
    final_payment_request_no = models.CharField(max_length=100, verbose_name='final_payment_request_no', null=True, blank=True)
    sign_verified = models.SmallIntegerField(verbose_name='sign_verified', default=0)
    last_callback_at = models.DateTimeField(verbose_name='last_callback_at', null=True, blank=True)
    last_compensation_at = models.DateTimeField(verbose_name='last_compensation_at', null=True, blank=True)
    last_compensation_result = models.CharField(max_length=32, verbose_name='last_compensation_result', null=True, blank=True)
    quoted_at = models.DateTimeField(verbose_name='quoted_at', null=True, blank=True)
    payable_start_at = models.DateTimeField(verbose_name='payable_start_at', null=True, blank=True)
    payment_deadline = models.DateField(verbose_name='payment_deadline', null=True, blank=True)
    paid_at = models.DateTimeField(verbose_name='paid_at', null=True, blank=True)
    payment_link = models.CharField(max_length=500, verbose_name='payment_link', null=True, blank=True)
    is_payment_cancelled = models.SmallIntegerField(verbose_name='is_payment_cancelled', default=0)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='created_at')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='updated_at')

    class Meta:
        db_table = 'ticket_payment'
        verbose_name = 'ticket_payment'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class TicketPaymentEventLog(models.Model):
    ticket_payment = models.ForeignKey('TicketPayment', on_delete=models.SET_NULL if False else models.CASCADE, verbose_name='ticket_payment_id')
    ticket = models.ForeignKey('Ticket', on_delete=models.SET_NULL if False else models.CASCADE, verbose_name='ticket_id')
    event_type = models.CharField(max_length=32, verbose_name='event_type')
    event_source = models.CharField(max_length=32, verbose_name='event_source', null=True, blank=True)
    event_result = models.CharField(max_length=32, verbose_name='event_result', null=True, blank=True)
    payment_result = models.CharField(max_length=32, verbose_name='payment_result', null=True, blank=True)
    payment_status = models.CharField(max_length=64, verbose_name='payment_status', null=True, blank=True)
    request_payload = models.TextField(verbose_name='request_payload', null=True, blank=True)
    response_payload = models.TextField(verbose_name='response_payload', null=True, blank=True)
    raw_payload = models.TextField(verbose_name='raw_payload', null=True, blank=True)
    event_time = models.DateTimeField(verbose_name='event_time', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='created_at')

    class Meta:
        db_table = 'ticket_payment_event_log'
        verbose_name = 'ticket_payment_event_log'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class TicketRefund(models.Model):
    ticket = models.ForeignKey('Ticket', on_delete=models.SET_NULL if False else models.CASCADE, verbose_name='ticket_id')
    ticket_payment = models.ForeignKey('TicketPayment', on_delete=models.SET_NULL if False else models.CASCADE, verbose_name='ticket_payment_id')
    refund_no = models.CharField(max_length=64, verbose_name='refund_no')
    refund_status = models.CharField(max_length=64, verbose_name='refund_status')
    refund_amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='refund_amount', null=True, blank=True)
    refund_time = models.DateTimeField(verbose_name='refund_time', null=True, blank=True)
    refund_result = models.CharField(max_length=100, verbose_name='refund_result', null=True, blank=True)
    refund_reason = models.TextField(verbose_name='refund_reason', null=True, blank=True)
    operator = models.ForeignKey('master_data.SysUser', on_delete=models.SET_NULL if True else models.CASCADE, verbose_name='operator_id', null=True, blank=True)
    remark = models.TextField(verbose_name='remark', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='created_at')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='updated_at')

    class Meta:
        db_table = 'ticket_refund'
        verbose_name = 'ticket_refund'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class TicketFulfillment(models.Model):
    ticket = models.ForeignKey('Ticket', on_delete=models.SET_NULL if False else models.CASCADE, verbose_name='ticket_id')
    delivery_method = models.CharField(max_length=32, verbose_name='delivery_method', null=True, blank=True)
    delivery_status = models.CharField(max_length=64, verbose_name='delivery_status', null=True, blank=True)
    carrier_name = models.CharField(max_length=100, verbose_name='carrier_name', null=True, blank=True)
    tracking_no = models.CharField(max_length=100, verbose_name='tracking_no', null=True, blank=True)
    outbound_ready_at = models.DateTimeField(verbose_name='outbound_ready_at', null=True, blank=True)
    outbound_completed_at = models.DateTimeField(verbose_name='outbound_completed_at', null=True, blank=True)
    delivery_started_at = models.DateTimeField(verbose_name='delivery_started_at', null=True, blank=True)
    delivered_at = models.DateTimeField(verbose_name='delivered_at', null=True, blank=True)
    signed_at = models.DateTimeField(verbose_name='signed_at', null=True, blank=True)
    store_arrived_at = models.DateTimeField(verbose_name='store_arrived_at', null=True, blank=True)
    store_received_at = models.DateTimeField(verbose_name='store_received_at', null=True, blank=True)
    customer_picked_at = models.DateTimeField(verbose_name='customer_picked_at', null=True, blank=True)
    visible_remark_3pl = models.TextField(verbose_name='visible_remark_3pl', null=True, blank=True)
    remark = models.TextField(verbose_name='remark', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='created_at')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='updated_at')

    class Meta:
        db_table = 'ticket_fulfillment'
        verbose_name = 'ticket_fulfillment'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class TicketInboundLogistics(models.Model):
    ticket = models.ForeignKey('Ticket', on_delete=models.SET_NULL if False else models.CASCADE, verbose_name='ticket_id')
    customer_phone = models.CharField(max_length=32, verbose_name='customer_phone', null=True, blank=True)
    carrier_name = models.CharField(max_length=100, verbose_name='carrier_name', null=True, blank=True)
    tracking_no = models.CharField(max_length=100, verbose_name='tracking_no', null=True, blank=True)
    shipped_at = models.DateTimeField(verbose_name='shipped_at', null=True, blank=True)
    remark = models.TextField(verbose_name='remark', null=True, blank=True)
    submit_source = models.CharField(max_length=32, verbose_name='submit_source', null=True, blank=True)
    shipping_info_status = models.CharField(max_length=32, verbose_name='shipping_info_status', default='PENDING')
    submitted_at = models.DateTimeField(verbose_name='submitted_at', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='created_at')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='updated_at')

    class Meta:
        db_table = 'ticket_inbound_logistics'
        verbose_name = 'ticket_inbound_logistics'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class TicketConsultation(models.Model):
    ticket = models.ForeignKey('Ticket', on_delete=models.SET_NULL if False else models.CASCADE, verbose_name='ticket_id')
    consultation_no = models.CharField(max_length=64, verbose_name='consultation_no')
    item_type = models.CharField(max_length=32, verbose_name='item_type')
    outbound_type = models.CharField(max_length=64, verbose_name='outbound_type', null=True, blank=True)
    consultation_channel = models.CharField(max_length=64, verbose_name='consultation_channel', null=True, blank=True)
    consultation_category = models.CharField(max_length=64, verbose_name='consultation_category', null=True, blank=True)
    consultation_demand_category = models.CharField(max_length=64, verbose_name='consultation_demand_category', null=True, blank=True)
    subject = models.CharField(max_length=200, verbose_name='subject', null=True, blank=True)
    content = models.TextField(verbose_name='content', null=True, blank=True)
    status = models.CharField(max_length=64, verbose_name='status')
    need_customer_confirm = models.SmallIntegerField(verbose_name='need_customer_confirm', default=0)
    customer_confirm_result = models.CharField(max_length=64, verbose_name='customer_confirm_result', null=True, blank=True)
    confirm_source = models.CharField(max_length=32, verbose_name='confirm_source', null=True, blank=True)
    launched_at = models.DateTimeField(verbose_name='launched_at', null=True, blank=True)
    confirm_deadline = models.DateTimeField(verbose_name='confirm_deadline', null=True, blank=True)
    confirmed_at = models.DateTimeField(verbose_name='confirmed_at', null=True, blank=True)
    owner = models.ForeignKey('master_data.SysUser', on_delete=models.SET_NULL if True else models.CASCADE, verbose_name='owner_id', null=True, blank=True)
    confirm_payload_json = models.TextField(verbose_name='confirm_payload_json', null=True, blank=True)
    confirm_notice_count = models.IntegerField(verbose_name='confirm_notice_count', default=0)
    last_contact_record = models.TextField(verbose_name='last_contact_record', null=True, blank=True)
    need_manual_follow_up = models.SmallIntegerField(verbose_name='need_manual_follow_up', default=0)
    follow_up_result = models.TextField(verbose_name='follow_up_result', null=True, blank=True)
    is_timeout = models.SmallIntegerField(verbose_name='is_timeout', default=0)
    timeout_at = models.DateTimeField(verbose_name='timeout_at', null=True, blank=True)
    process_result = models.TextField(verbose_name='process_result', null=True, blank=True)
    is_blocking_main_flow = models.SmallIntegerField(verbose_name='is_blocking_main_flow', default=0)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='created_at')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='updated_at')

    class Meta:
        db_table = 'ticket_consultation'
        verbose_name = 'ticket_consultation'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class TicketCancelLog(models.Model):
    ticket = models.ForeignKey('Ticket', on_delete=models.SET_NULL if False else models.CASCADE, verbose_name='ticket_id')
    cancel_source = models.CharField(max_length=32, verbose_name='cancel_source')
    cancel_reason = models.CharField(max_length=200, verbose_name='cancel_reason', null=True, blank=True)
    cancel_remark = models.TextField(verbose_name='cancel_remark', null=True, blank=True)
    apply_time = models.DateTimeField(verbose_name='apply_time', null=True, blank=True)
    cancel_result = models.CharField(max_length=32, verbose_name='cancel_result')
    result_reason = models.TextField(verbose_name='result_reason', null=True, blank=True)
    processed_at = models.DateTimeField(verbose_name='processed_at', null=True, blank=True)
    processed_by = models.BigIntegerField(verbose_name='processed_by', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='created_at')

    class Meta:
        db_table = 'ticket_cancel_log'
        verbose_name = 'ticket_cancel_log'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class TicketConsultationAttachment(models.Model):
    consultation_id = models.BigIntegerField(verbose_name='consultation_id')
    attachment_type = models.CharField(max_length=32, verbose_name='attachment_type')
    file_name = models.CharField(max_length=255, verbose_name='file_name', null=True, blank=True)
    file_url = models.CharField(max_length=500, verbose_name='file_url')
    sort_no = models.IntegerField(verbose_name='sort_no', default=0)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='created_at')

    class Meta:
        db_table = 'ticket_consultation_attachment'
        verbose_name = 'ticket_consultation_attachment'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class TicketAttachment(models.Model):
    ticket = models.ForeignKey('Ticket', on_delete=models.SET_NULL if False else models.CASCADE, verbose_name='ticket_id')
    file_name = models.CharField(max_length=255, verbose_name='file_name')
    title = models.CharField(max_length=200, verbose_name='title', null=True, blank=True)
    file_type = models.CharField(max_length=50, verbose_name='file_type', null=True, blank=True)
    file_size = models.BigIntegerField(verbose_name='file_size', null=True, blank=True)
    file_url = models.CharField(max_length=500, verbose_name='file_url')
    uploaded_by = models.BigIntegerField(verbose_name='uploaded_by', null=True, blank=True)
    uploaded_at = models.DateTimeField(verbose_name='uploaded_at')
    updated_by = models.BigIntegerField(verbose_name='updated_by', null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, verbose_name='updated_at')

    class Meta:
        db_table = 'ticket_attachment'
        verbose_name = 'ticket_attachment'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class TicketProgress(models.Model):
    ticket = models.ForeignKey('Ticket', on_delete=models.SET_NULL if False else models.CASCADE, verbose_name='ticket_id')
    progress_time = models.DateTimeField(verbose_name='progress_time')
    progress_type = models.CharField(max_length=64, verbose_name='progress_type')
    progress_title = models.CharField(max_length=200, verbose_name='progress_title', null=True, blank=True)
    progress_content = models.TextField(verbose_name='progress_content', null=True, blank=True)
    source_type = models.CharField(max_length=32, verbose_name='source_type')
    is_customer_visible = models.SmallIntegerField(verbose_name='is_customer_visible', default=1)
    created_by = models.BigIntegerField(verbose_name='created_by', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='created_at')

    class Meta:
        db_table = 'ticket_progress'
        verbose_name = 'ticket_progress'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class TicketStatusLog(models.Model):
    ticket = models.ForeignKey('Ticket', on_delete=models.SET_NULL if False else models.CASCADE, verbose_name='ticket_id')
    from_status_code = models.CharField(max_length=64, verbose_name='from_status_code', null=True, blank=True)
    action_code = models.CharField(max_length=64, verbose_name='action_code')
    to_status_code = models.CharField(max_length=64, verbose_name='to_status_code')
    trigger_type = models.CharField(max_length=32, verbose_name='trigger_type')
    operator = models.ForeignKey('master_data.SysUser', on_delete=models.SET_NULL if True else models.CASCADE, verbose_name='operator_id', null=True, blank=True)
    operator_role_code = models.CharField(max_length=64, verbose_name='operator_role_code', null=True, blank=True)
    trigger_source = models.CharField(max_length=100, verbose_name='trigger_source', null=True, blank=True)
    remark = models.TextField(verbose_name='remark', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='created_at')

    class Meta:
        db_table = 'ticket_status_log'
        verbose_name = 'ticket_status_log'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class TicketActionLog(models.Model):
    ticket = models.ForeignKey('Ticket', on_delete=models.SET_NULL if False else models.CASCADE, verbose_name='ticket_id')
    action_code = models.CharField(max_length=64, verbose_name='action_code')
    action_name = models.CharField(max_length=100, verbose_name='action_name', null=True, blank=True)
    execute_result = models.CharField(max_length=32, verbose_name='execute_result')
    fail_reason = models.TextField(verbose_name='fail_reason', null=True, blank=True)
    request_payload = models.JSONField(verbose_name='request_payload', null=True, blank=True)
    operator = models.ForeignKey('master_data.SysUser', on_delete=models.SET_NULL if True else models.CASCADE, verbose_name='operator_id', null=True, blank=True)
    executed_at = models.DateTimeField(verbose_name='executed_at')

    class Meta:
        db_table = 'ticket_action_log'
        verbose_name = 'ticket_action_log'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class TicketException(models.Model):
    ticket = models.ForeignKey('Ticket', on_delete=models.SET_NULL if False else models.CASCADE, verbose_name='ticket_id')
    exception_type = models.CharField(max_length=64, verbose_name='exception_type')
    exception_code = models.CharField(max_length=64, verbose_name='exception_code', null=True, blank=True)
    exception_status = models.CharField(max_length=32, verbose_name='exception_status')
    exception_content = models.TextField(verbose_name='exception_content', null=True, blank=True)
    owner = models.ForeignKey('master_data.SysUser', on_delete=models.SET_NULL if True else models.CASCADE, verbose_name='owner_id', null=True, blank=True)
    process_result = models.TextField(verbose_name='process_result', null=True, blank=True)
    occurred_at = models.DateTimeField(verbose_name='occurred_at')
    resolved_at = models.DateTimeField(verbose_name='resolved_at', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='created_at')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='updated_at')

    class Meta:
        db_table = 'ticket_exception'
        verbose_name = 'ticket_exception'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class TicketAvailableAction(models.Model):
    ticket = models.ForeignKey('Ticket', on_delete=models.SET_NULL if False else models.CASCADE, verbose_name='ticket_id')
    action_code = models.CharField(max_length=64, verbose_name='action_code')
    action_name = models.CharField(max_length=100, verbose_name='action_name', null=True, blank=True)
    source_status_code = models.CharField(max_length=64, verbose_name='source_status_code')
    is_enabled = models.SmallIntegerField(verbose_name='is_enabled', default=1)
    disabled_reason = models.CharField(max_length=255, verbose_name='disabled_reason', null=True, blank=True)
    generated_at = models.DateTimeField(verbose_name='generated_at')

    class Meta:
        db_table = 'ticket_available_action'
        verbose_name = 'ticket_available_action'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


