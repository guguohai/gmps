from django.db import models

class InventoryBalance(models.Model):
    item_type = models.CharField(max_length=32, verbose_name='item_type')
    product = models.ForeignKey('master_data.Product', on_delete=models.SET_NULL if True else models.CASCADE, verbose_name='product_id', null=True, blank=True)
    part = models.ForeignKey('master_data.Part', on_delete=models.SET_NULL if True else models.CASCADE, verbose_name='part_id', null=True, blank=True)
    warehouse_code = models.CharField(max_length=64, verbose_name='warehouse_code')
    location_code = models.CharField(max_length=64, verbose_name='location_code')
    sap_qty = models.IntegerField(verbose_name='sap_qty', default=0)
    ps_qty = models.IntegerField(verbose_name='ps_qty', default=0)
    frozen_qty = models.IntegerField(verbose_name='frozen_qty', default=0)
    transit_qty = models.IntegerField(verbose_name='transit_qty', default=0)
    available_qty = models.IntegerField(verbose_name='available_qty', default=0)
    updated_at = models.DateTimeField(auto_now=True, verbose_name='updated_at')

    class Meta:
        db_table = 'inventory_balance'
        verbose_name = 'inventory_balance'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class InventoryTxn(models.Model):
    txn_no = models.CharField(max_length=64, verbose_name='txn_no')
    item_type = models.CharField(max_length=32, verbose_name='item_type')
    product = models.ForeignKey('master_data.Product', on_delete=models.SET_NULL if True else models.CASCADE, verbose_name='product_id', null=True, blank=True)
    part = models.ForeignKey('master_data.Part', on_delete=models.SET_NULL if True else models.CASCADE, verbose_name='part_id', null=True, blank=True)
    record_type = models.CharField(max_length=64, verbose_name='record_type')
    biz_doc_type = models.CharField(max_length=64, verbose_name='biz_doc_type', null=True, blank=True)
    biz_doc_no = models.CharField(max_length=64, verbose_name='biz_doc_no', null=True, blank=True)
    related_txn_no = models.CharField(max_length=64, verbose_name='related_txn_no', null=True, blank=True)
    warehouse_code = models.CharField(max_length=64, verbose_name='warehouse_code')
    location_code = models.CharField(max_length=64, verbose_name='location_code')
    qty_before = models.IntegerField(verbose_name='qty_before', default=0)
    change_qty = models.IntegerField(verbose_name='change_qty', default=0)
    qty_after = models.IntegerField(verbose_name='qty_after', default=0)
    change_direction = models.CharField(max_length=32, verbose_name='change_direction')
    source_type = models.CharField(max_length=64, verbose_name='source_type', null=True, blank=True)
    source_no = models.CharField(max_length=64, verbose_name='source_no', null=True, blank=True)
    operated_by = models.BigIntegerField(verbose_name='operated_by', null=True, blank=True)
    operated_at = models.DateTimeField(verbose_name='operated_at')
    remark = models.TextField(verbose_name='remark', null=True, blank=True)

    class Meta:
        db_table = 'inventory_txn'
        verbose_name = 'inventory_txn'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class InventoryRequest(models.Model):
    request_no = models.CharField(max_length=64, verbose_name='request_no')
    ticket = models.ForeignKey('tickets.Ticket', on_delete=models.SET_NULL if True else models.CASCADE, verbose_name='ticket_id', null=True, blank=True)
    product = models.ForeignKey('master_data.Product', on_delete=models.SET_NULL if False else models.CASCADE, verbose_name='product_id')
    request_type = models.CharField(max_length=64, verbose_name='request_type', null=True, blank=True)
    request_qty = models.IntegerField(verbose_name='request_qty', default=1)
    progress_status = models.CharField(max_length=32, verbose_name='progress_status')
    request_reason = models.TextField(verbose_name='request_reason', null=True, blank=True)
    requester = models.ForeignKey('master_data.SysUser', on_delete=models.SET_NULL if True else models.CASCADE, verbose_name='requester_id', null=True, blank=True)
    processor = models.ForeignKey('master_data.SysUser', on_delete=models.SET_NULL if True else models.CASCADE, verbose_name='processor_id', null=True, blank=True)
    process_time = models.DateTimeField(verbose_name='process_time', null=True, blank=True)
    remark = models.TextField(verbose_name='remark', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='created_at')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='updated_at')

    class Meta:
        db_table = 'inventory_request'
        verbose_name = 'inventory_request'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class PartRequest(models.Model):
    part_request_no = models.CharField(max_length=64, verbose_name='part_request_no')
    ticket = models.ForeignKey('tickets.Ticket', on_delete=models.SET_NULL if True else models.CASCADE, verbose_name='ticket_id', null=True, blank=True)
    requester = models.ForeignKey('master_data.SysUser', on_delete=models.SET_NULL if True else models.CASCADE, verbose_name='requester_id', null=True, blank=True)
    requester_store_id = models.BigIntegerField(verbose_name='requester_store_id', null=True, blank=True)
    product = models.ForeignKey('master_data.Product', on_delete=models.SET_NULL if True else models.CASCADE, verbose_name='product_id', null=True, blank=True)
    part = models.ForeignKey('master_data.Part', on_delete=models.SET_NULL if False else models.CASCADE, verbose_name='part_id')
    color = models.CharField(max_length=50, verbose_name='color', null=True, blank=True)
    request_qty = models.IntegerField(verbose_name='request_qty', default=1)
    extra_request = models.TextField(verbose_name='extra_request', null=True, blank=True)
    progress_status = models.CharField(max_length=32, verbose_name='progress_status')
    processor = models.ForeignKey('master_data.SysUser', on_delete=models.SET_NULL if True else models.CASCADE, verbose_name='processor_id', null=True, blank=True)
    process_time = models.DateTimeField(verbose_name='process_time', null=True, blank=True)
    remark = models.TextField(verbose_name='remark', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='created_at')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='updated_at')

    class Meta:
        db_table = 'part_request'
        verbose_name = 'part_request'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class InventoryDiff(models.Model):
    diff_no = models.CharField(max_length=64, verbose_name='diff_no')
    diff_source = models.CharField(max_length=64, verbose_name='diff_source')
    item_type = models.CharField(max_length=32, verbose_name='item_type')
    product = models.ForeignKey('master_data.Product', on_delete=models.SET_NULL if True else models.CASCADE, verbose_name='product_id', null=True, blank=True)
    part = models.ForeignKey('master_data.Part', on_delete=models.SET_NULL if True else models.CASCADE, verbose_name='part_id', null=True, blank=True)
    warehouse_code = models.CharField(max_length=64, verbose_name='warehouse_code')
    location_code = models.CharField(max_length=64, verbose_name='location_code')
    sap_qty = models.IntegerField(verbose_name='sap_qty', default=0)
    ps_qty = models.IntegerField(verbose_name='ps_qty', default=0)
    diff_qty = models.IntegerField(verbose_name='diff_qty', default=0)
    diff_reason = models.CharField(max_length=64, verbose_name='diff_reason', null=True, blank=True)
    process_method = models.CharField(max_length=64, verbose_name='process_method', null=True, blank=True)
    fix_qty = models.IntegerField(verbose_name='fix_qty', null=True, blank=True)
    result_no = models.CharField(max_length=64, verbose_name='result_no', null=True, blank=True)
    process_status = models.CharField(max_length=32, verbose_name='process_status')
    processor = models.ForeignKey('master_data.SysUser', on_delete=models.SET_NULL if True else models.CASCADE, verbose_name='processor_id', null=True, blank=True)
    found_at = models.DateTimeField(verbose_name='found_at')
    process_time = models.DateTimeField(verbose_name='process_time', null=True, blank=True)
    process_desc = models.TextField(verbose_name='process_desc', null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, verbose_name='updated_at')

    class Meta:
        db_table = 'inventory_diff'
        verbose_name = 'inventory_diff'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class InventorySyncLog(models.Model):
    sync_batch_no = models.CharField(max_length=64, verbose_name='sync_batch_no')
    sync_object = models.CharField(max_length=64, verbose_name='sync_object')
    sync_type = models.CharField(max_length=64, verbose_name='sync_type')
    trigger_type = models.CharField(max_length=32, verbose_name='trigger_type')
    status = models.CharField(max_length=32, verbose_name='status')
    success_count = models.IntegerField(verbose_name='success_count', default=0)
    fail_count = models.IntegerField(verbose_name='fail_count', default=0)
    diff_count = models.IntegerField(verbose_name='diff_count', default=0)
    source_system = models.CharField(max_length=64, verbose_name='source_system', default='SAP')
    target_system = models.CharField(max_length=64, verbose_name='target_system', default='PS_ADMIN')
    job_name = models.CharField(max_length=100, verbose_name='job_name', null=True, blank=True)
    executor_name = models.CharField(max_length=100, verbose_name='executor_name', null=True, blank=True)
    started_at = models.DateTimeField(verbose_name='started_at', null=True, blank=True)
    ended_at = models.DateTimeField(verbose_name='ended_at', null=True, blank=True)
    error_summary = models.TextField(verbose_name='error_summary', null=True, blank=True)
    fail_detail = models.TextField(verbose_name='fail_detail', null=True, blank=True)
    process_result = models.TextField(verbose_name='process_result', null=True, blank=True)
    remark = models.TextField(verbose_name='remark', null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, verbose_name='updated_at')

    class Meta:
        db_table = 'inventory_sync_log'
        verbose_name = 'inventory_sync_log'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


