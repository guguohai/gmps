from django.db import models

class NotificationTemplate(models.Model):
    template_code = models.CharField(max_length=64, verbose_name='template_code')
    template_type = models.CharField(max_length=64, verbose_name='template_type')
    template_name = models.CharField(max_length=200, verbose_name='template_name')
    template_title = models.CharField(max_length=200, verbose_name='template_title', null=True, blank=True)
    template_content = models.TextField(verbose_name='template_content', null=True, blank=True)
    business_scene = models.CharField(max_length=100, verbose_name='business_scene', null=True, blank=True)
    trigger_node = models.CharField(max_length=100, verbose_name='trigger_node', null=True, blank=True)
    lang_code = models.CharField(max_length=20, verbose_name='lang_code', null=True, blank=True)
    variable_desc = models.TextField(verbose_name='variable_desc', null=True, blank=True)
    is_default = models.SmallIntegerField(verbose_name='is_default', default=0)
    status = models.CharField(max_length=32, verbose_name='status', default='ENABLED')
    remark = models.TextField(verbose_name='remark', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='created_at')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='updated_at')

    class Meta:
        db_table = 'notification_template'
        verbose_name = 'notification_template'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class NotificationSendLog(models.Model):
    ticket = models.ForeignKey('tickets.Ticket', on_delete=models.SET_NULL if True else models.CASCADE, verbose_name='ticket_id', null=True, blank=True)
    template_id = models.BigIntegerField(verbose_name='template_id', null=True, blank=True)
    message_id = models.CharField(max_length=64, verbose_name='message_id', null=True, blank=True)
    event_code = models.CharField(max_length=64, verbose_name='event_code', null=True, blank=True)
    event_name = models.CharField(max_length=100, verbose_name='event_name', null=True, blank=True)
    biz_no = models.CharField(max_length=64, verbose_name='biz_no', null=True, blank=True)
    channel_type = models.CharField(max_length=32, verbose_name='channel_type')
    template_name = models.CharField(max_length=200, verbose_name='template_name', null=True, blank=True)
    receiver = models.CharField(max_length=255, verbose_name='receiver', null=True, blank=True)
    receiver_type = models.CharField(max_length=32, verbose_name='receiver_type', null=True, blank=True)
    summary = models.CharField(max_length=500, verbose_name='summary', null=True, blank=True)
    event_time = models.DateTimeField(verbose_name='event_time', null=True, blank=True)
    sent_at = models.DateTimeField(verbose_name='sent_at', null=True, blank=True)
    send_status = models.CharField(max_length=32, verbose_name='send_status')
    retry_count = models.IntegerField(verbose_name='retry_count', default=0)
    fail_reason = models.TextField(verbose_name='fail_reason', null=True, blank=True)
    callback_url = models.CharField(max_length=500, verbose_name='callback_url', null=True, blank=True)
    request_payload = models.TextField(verbose_name='request_payload', null=True, blank=True)
    response_payload = models.TextField(verbose_name='response_payload', null=True, blank=True)
    created_by = models.BigIntegerField(verbose_name='created_by', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='created_at')

    class Meta:
        db_table = 'notification_send_log'
        verbose_name = 'notification_send_log'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class SysDictItem(models.Model):
    dict_type = models.CharField(max_length=64, verbose_name='dict_type')
    dict_code = models.CharField(max_length=64, verbose_name='dict_code')
    dict_name = models.CharField(max_length=100, verbose_name='dict_name')
    dict_name_en = models.CharField(max_length=100, verbose_name='dict_name_en', null=True, blank=True)
    dict_name_ko = models.CharField(max_length=100, verbose_name='dict_name_ko', null=True, blank=True)
    parent_id = models.BigIntegerField(verbose_name='parent_id', null=True, blank=True)
    sort_no = models.IntegerField(verbose_name='sort_no', default=0)
    is_default = models.SmallIntegerField(verbose_name='is_default', default=0)
    status = models.CharField(max_length=32, verbose_name='status', default='ENABLED')
    ext_value_1 = models.CharField(max_length=255, verbose_name='ext_value_1', null=True, blank=True)
    ext_value_2 = models.CharField(max_length=255, verbose_name='ext_value_2', null=True, blank=True)
    remark = models.TextField(verbose_name='remark', null=True, blank=True)
    updated_by = models.BigIntegerField(verbose_name='updated_by', null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, verbose_name='updated_at')

    class Meta:
        db_table = 'sys_dict_item'
        verbose_name = 'sys_dict_item'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class ExternalInterfaceConfig(models.Model):
    system_code = models.CharField(max_length=64, verbose_name='system_code')
    interface_type = models.CharField(max_length=64, verbose_name='interface_type')
    interface_name = models.CharField(max_length=100, verbose_name='interface_name', null=True, blank=True)
    endpoint_url = models.CharField(max_length=500, verbose_name='endpoint_url')
    http_method = models.CharField(max_length=16, verbose_name='http_method', null=True, blank=True)
    sign_algorithm = models.CharField(max_length=64, verbose_name='sign_algorithm', null=True, blank=True)
    sign_secret = models.CharField(max_length=255, verbose_name='sign_secret', null=True, blank=True)
    timeout_ms = models.IntegerField(verbose_name='timeout_ms', default=5000)
    status = models.CharField(max_length=32, verbose_name='status', default='ENABLED')
    remark = models.TextField(verbose_name='remark', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='created_at')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='updated_at')

    class Meta:
        db_table = 'external_interface_config'
        verbose_name = 'external_interface_config'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


