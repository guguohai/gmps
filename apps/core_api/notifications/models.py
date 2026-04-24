from django.db import models


class NotificationTemplate(models.Model):
    id = models.BigAutoField(primary_key=True)
    template_code = models.CharField(max_length=64)
    template_type = models.CharField(max_length=64)
    template_name = models.CharField(max_length=200)
    template_title = models.CharField(max_length=200, null=True, blank=True)
    template_content = models.TextField(null=True, blank=True)
    business_scene = models.CharField(max_length=100, null=True, blank=True)
    trigger_node = models.CharField(max_length=100, null=True, blank=True)
    lang_code = models.CharField(max_length=20, null=True, blank=True)
    variable_desc = models.TextField(null=True, blank=True)
    is_default = models.SmallIntegerField(default=0)
    status = models.CharField(max_length=32, default='ENABLED')
    remark = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'notification_template'
        constraints = [
            models.UniqueConstraint(fields=['template_code'], name='uk_notification_template_template_code'),
        ]
        verbose_name = 'notification_template'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class NotificationSendLog(models.Model):
    id = models.BigAutoField(primary_key=True)
    ticket = models.ForeignKey('tickets.Ticket', on_delete=models.DO_NOTHING, related_name='+', db_index=False, null=True, blank=True)
    template = models.ForeignKey('NotificationTemplate', on_delete=models.DO_NOTHING, related_name='+', db_index=False, null=True, blank=True)
    message_id = models.CharField(max_length=64, null=True, blank=True)
    event_code = models.CharField(max_length=64, null=True, blank=True)
    event_name = models.CharField(max_length=100, null=True, blank=True)
    biz_no = models.CharField(max_length=64, null=True, blank=True)
    channel_type = models.CharField(max_length=32)
    template_name = models.CharField(max_length=200, null=True, blank=True)
    receiver = models.CharField(max_length=255, null=True, blank=True)
    receiver_type = models.CharField(max_length=32, null=True, blank=True)
    summary = models.CharField(max_length=500, null=True, blank=True)
    event_time = models.DateTimeField(null=True, blank=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    send_status = models.CharField(max_length=32)
    retry_count = models.IntegerField(default=0)
    fail_reason = models.TextField(null=True, blank=True)
    callback_url = models.CharField(max_length=500, null=True, blank=True)
    request_payload = models.TextField(null=True, blank=True)
    response_payload = models.TextField(null=True, blank=True)
    created_by = models.ForeignKey('master_data.SysUser', on_delete=models.DO_NOTHING, related_name='+', db_index=False, db_column='created_by', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'notification_send_log'
        constraints = [
            models.UniqueConstraint(fields=['message_id'], name='uk_notification_send_log_message_id'),
        ]
        indexes = [
            models.Index(fields=['ticket', 'sent_at'], name='idx_notification_send_log_ticket_sent_at'),
            models.Index(fields=['event_code', 'event_time'], name='idx_notification_send_log_event_code_time'),
        ]
        verbose_name = 'notification_send_log'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class SysDictItem(models.Model):
    id = models.BigAutoField(primary_key=True)
    dict_type = models.CharField(max_length=64)
    dict_code = models.CharField(max_length=64)
    dict_name = models.CharField(max_length=100)
    dict_name_en = models.CharField(max_length=100, null=True, blank=True)
    dict_name_ko = models.CharField(max_length=100, null=True, blank=True)
    parent = models.ForeignKey('SysDictItem', on_delete=models.DO_NOTHING, related_name='+', db_index=False, null=True, blank=True)
    sort_no = models.IntegerField(default=0)
    is_default = models.SmallIntegerField(default=0)
    status = models.CharField(max_length=32, default='ENABLED')
    ext_value_1 = models.CharField(max_length=255, null=True, blank=True)
    ext_value_2 = models.CharField(max_length=255, null=True, blank=True)
    remark = models.TextField(null=True, blank=True)
    updated_by = models.ForeignKey('master_data.SysUser', on_delete=models.DO_NOTHING, related_name='+', db_index=False, db_column='updated_by', null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'sys_dict_item'
        constraints = [
            models.UniqueConstraint(fields=['dict_code'], name='uk_sys_dict_item_dict_code'),
        ]
        indexes = [
            models.Index(fields=['dict_type', 'sort_no'], name='idx_sys_dict_item_type_sort'),
            models.Index(fields=['parent'], name='idx_sys_dict_item_parent_id'),
        ]
        verbose_name = 'sys_dict_item'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class ExternalInterfaceConfig(models.Model):
    id = models.BigAutoField(primary_key=True)
    system_code = models.CharField(max_length=64)
    interface_type = models.CharField(max_length=64)
    interface_name = models.CharField(max_length=100, null=True, blank=True)
    endpoint_url = models.CharField(max_length=500)
    http_method = models.CharField(max_length=16, null=True, blank=True)
    sign_algorithm = models.CharField(max_length=64, null=True, blank=True)
    sign_secret = models.CharField(max_length=255, null=True, blank=True)
    timeout_ms = models.IntegerField(default=5000)
    status = models.CharField(max_length=32, default='ENABLED')
    remark = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'external_interface_config'
        constraints = [
            models.UniqueConstraint(fields=['system_code', 'interface_type'], name='uk_external_interface_config_system_type'),
        ]
        verbose_name = 'external_interface_config'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)
