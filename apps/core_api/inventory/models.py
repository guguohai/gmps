from django.db import models
from django.utils import timezone


class InventoryBalance(models.Model):
    id = models.BigAutoField(primary_key=True)
    item_type = models.CharField(max_length=32)
    product_id = models.BigIntegerField(null=True, blank=True)
    part_id = models.BigIntegerField(null=True, blank=True)
    warehouse_code = models.CharField(max_length=64)
    location_code = models.CharField(max_length=64)
    sap_qty = models.IntegerField(default=0)
    ps_qty = models.IntegerField(default=0)
    frozen_qty = models.IntegerField(default=0)
    transit_qty = models.IntegerField(default=0)
    available_qty = models.IntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'inventory_balance'
        constraints = [
            models.UniqueConstraint(fields=['item_type', 'product_id', 'part_id', 'warehouse_code', 'location_code'], name='uk_inventory_balance_core'),
        ]
        verbose_name = 'inventory_balance'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class InventoryTxn(models.Model):
    id = models.BigAutoField(primary_key=True)
    txn_no = models.CharField(max_length=64)
    item_type = models.CharField(max_length=32)
    product_id = models.BigIntegerField(null=True, blank=True)
    part_id = models.BigIntegerField(null=True, blank=True)
    record_type = models.CharField(max_length=64)
    biz_doc_type = models.CharField(max_length=64, null=True, blank=True)
    biz_doc_no = models.CharField(max_length=64, null=True, blank=True)
    related_txn_no = models.CharField(max_length=64, null=True, blank=True)
    warehouse_code = models.CharField(max_length=64)
    location_code = models.CharField(max_length=64)
    qty_before = models.IntegerField(default=0)
    change_qty = models.IntegerField(default=0)
    qty_after = models.IntegerField(default=0)
    change_direction = models.CharField(max_length=32)
    source_type = models.CharField(max_length=64, null=True, blank=True)
    source_no = models.CharField(max_length=64, null=True, blank=True)
    operated_by = models.ForeignKey('master_data.SysUser', on_delete=models.DO_NOTHING, related_name='+', db_index=False, db_column='operated_by', null=True, blank=True)
    operated_at = models.DateTimeField(default=timezone.now)
    remark = models.TextField(null=True, blank=True)

    class Meta:
        db_table = 'inventory_txn'
        constraints = [
            models.UniqueConstraint(fields=['txn_no'], name='uk_inventory_txn_txn_no'),
        ]
        indexes = [
            models.Index(fields=['item_type', 'product_id', 'part_id', 'operated_at'], name='idx_inventory_txn_item_operated'),
            models.Index(fields=['biz_doc_type', 'biz_doc_no'], name='idx_inventory_txn_doc_no'),
            models.Index(fields=['warehouse_code', 'location_code', 'operated_at'], name='idx_inventory_txn_warehouse_location_time'),
        ]
        verbose_name = 'inventory_txn'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class InventoryRequest(models.Model):
    id = models.BigAutoField(primary_key=True)
    request_no = models.CharField(max_length=64)
    ticket = models.ForeignKey('tickets.Ticket', on_delete=models.DO_NOTHING, related_name='+', db_index=False, null=True, blank=True)
    product = models.ForeignKey('master_data.Product', on_delete=models.DO_NOTHING, related_name='+', db_index=False)
    request_type = models.CharField(max_length=64, null=True, blank=True)
    request_qty = models.IntegerField(default=1)
    progress_status = models.CharField(max_length=32)
    request_reason = models.TextField(null=True, blank=True)
    requester = models.ForeignKey('master_data.SysUser', on_delete=models.DO_NOTHING, related_name='+', db_index=False, null=True, blank=True)
    processor = models.ForeignKey('master_data.SysUser', on_delete=models.DO_NOTHING, related_name='+', db_index=False, null=True, blank=True)
    process_time = models.DateTimeField(null=True, blank=True)
    remark = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'inventory_request'
        constraints = [
            models.UniqueConstraint(fields=['request_no'], name='uk_inventory_request_request_no'),
        ]
        indexes = [
            models.Index(fields=['ticket', 'progress_status'], name='idx_inventory_request_ticket_status'),
            models.Index(fields=['processor', 'progress_status'], name='idx_inventory_request_processor_status'),
        ]
        verbose_name = 'inventory_request'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class PartRequest(models.Model):
    id = models.BigAutoField(primary_key=True)
    part_request_no = models.CharField(max_length=64)
    ticket = models.ForeignKey('tickets.Ticket', on_delete=models.DO_NOTHING, related_name='+', db_index=False, null=True, blank=True)
    requester = models.ForeignKey('master_data.SysUser', on_delete=models.DO_NOTHING, related_name='+', db_index=False, null=True, blank=True)
    requester_store = models.ForeignKey('master_data.Store', on_delete=models.DO_NOTHING, related_name='+', db_index=False, null=True, blank=True)
    product = models.ForeignKey('master_data.Product', on_delete=models.DO_NOTHING, related_name='+', db_index=False, null=True, blank=True)
    part = models.ForeignKey('master_data.Part', on_delete=models.DO_NOTHING, related_name='+', db_index=False)
    color = models.CharField(max_length=50, null=True, blank=True)
    request_qty = models.IntegerField(default=1)
    extra_request = models.TextField(null=True, blank=True)
    progress_status = models.CharField(max_length=32)
    processor = models.ForeignKey('master_data.SysUser', on_delete=models.DO_NOTHING, related_name='+', db_index=False, null=True, blank=True)
    process_time = models.DateTimeField(null=True, blank=True)
    remark = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'part_request'
        constraints = [
            models.UniqueConstraint(fields=['part_request_no'], name='uk_part_request_part_request_no'),
        ]
        indexes = [
            models.Index(fields=['ticket', 'progress_status'], name='idx_part_request_ticket_status'),
            models.Index(fields=['processor', 'progress_status'], name='idx_part_request_processor_status'),
        ]
        verbose_name = 'part_request'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class InventoryDiff(models.Model):
    id = models.BigAutoField(primary_key=True)
    diff_no = models.CharField(max_length=64)
    diff_source = models.CharField(max_length=64)
    item_type = models.CharField(max_length=32)
    product_id = models.BigIntegerField(null=True, blank=True)
    part_id = models.BigIntegerField(null=True, blank=True)
    warehouse_code = models.CharField(max_length=64)
    location_code = models.CharField(max_length=64)
    sap_qty = models.IntegerField(default=0)
    ps_qty = models.IntegerField(default=0)
    diff_qty = models.IntegerField(default=0)
    diff_reason = models.CharField(max_length=64, null=True, blank=True)
    process_method = models.CharField(max_length=64, null=True, blank=True)
    fix_qty = models.IntegerField(null=True, blank=True)
    result_no = models.CharField(max_length=64, null=True, blank=True)
    process_status = models.CharField(max_length=32)
    processor = models.ForeignKey('master_data.SysUser', on_delete=models.DO_NOTHING, related_name='+', db_index=False, null=True, blank=True)
    found_at = models.DateTimeField(default=timezone.now)
    process_time = models.DateTimeField(null=True, blank=True)
    process_desc = models.TextField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'inventory_diff'
        constraints = [
            models.UniqueConstraint(fields=['diff_no'], name='uk_inventory_diff_diff_no'),
        ]
        indexes = [
            models.Index(fields=['process_status', 'found_at'], name='idx_inventory_diff_status_found'),
            models.Index(fields=['item_type', 'product_id', 'part_id'], name='idx_inventory_diff_item'),
            models.Index(fields=['warehouse_code', 'location_code'], name='idx_inventory_diff_warehouse_location'),
        ]
        verbose_name = 'inventory_diff'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class InventorySyncLog(models.Model):
    id = models.BigAutoField(primary_key=True)
    sync_batch_no = models.CharField(max_length=64)
    sync_object = models.CharField(max_length=64)
    sync_type = models.CharField(max_length=64)
    trigger_type = models.CharField(max_length=32)
    status = models.CharField(max_length=32)
    success_count = models.IntegerField(default=0)
    fail_count = models.IntegerField(default=0)
    diff_count = models.IntegerField(default=0)
    source_system = models.CharField(max_length=64, default='SAP')
    target_system = models.CharField(max_length=64, default='PS_ADMIN')
    job_name = models.CharField(max_length=100, null=True, blank=True)
    executor_name = models.CharField(max_length=100, null=True, blank=True)
    started_at = models.DateTimeField(null=True, blank=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    error_summary = models.TextField(null=True, blank=True)
    fail_detail = models.TextField(null=True, blank=True)
    process_result = models.TextField(null=True, blank=True)
    remark = models.TextField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'inventory_sync_log'
        constraints = [
            models.UniqueConstraint(fields=['sync_batch_no'], name='uk_inventory_sync_log_sync_batch_no'),
        ]
        indexes = [
            models.Index(fields=['sync_object', 'status', 'started_at'], name='idx_inventory_sync_log_object_status_started'),
        ]
        verbose_name = 'inventory_sync_log'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)
