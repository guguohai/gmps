from django.db import models

class WfStatus(models.Model):
    biz_type = models.CharField(max_length=32, verbose_name='biz_type')
    status_code = models.CharField(max_length=64, verbose_name='status_code')
    status_name = models.CharField(max_length=100, verbose_name='status_name')
    status_name_en = models.CharField(max_length=100, verbose_name='status_name_en', null=True, blank=True)
    status_name_ko = models.CharField(max_length=100, verbose_name='status_name_ko', null=True, blank=True)
    status_level = models.CharField(max_length=32, verbose_name='status_level')
    main_status_code = models.CharField(max_length=64, verbose_name='main_status_code', null=True, blank=True)
    customer_status_code = models.CharField(max_length=64, verbose_name='customer_status_code', null=True, blank=True)
    progress_node_code = models.CharField(max_length=64, verbose_name='progress_node_code', null=True, blank=True)
    is_initial = models.SmallIntegerField(verbose_name='is_initial', default=0)
    is_final = models.SmallIntegerField(verbose_name='is_final', default=0)
    is_system_only = models.SmallIntegerField(verbose_name='is_system_only', default=0)
    allow_manual_set = models.SmallIntegerField(verbose_name='allow_manual_set', default=0)
    sort_no = models.IntegerField(verbose_name='sort_no', default=0)
    status = models.CharField(max_length=32, verbose_name='status', default='ENABLED')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='created_at')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='updated_at')

    class Meta:
        db_table = 'wf_status'
        verbose_name = 'wf_status'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class WfAction(models.Model):
    biz_type = models.CharField(max_length=32, verbose_name='biz_type')
    action_code = models.CharField(max_length=64, verbose_name='action_code')
    action_name = models.CharField(max_length=100, verbose_name='action_name')
    action_type = models.CharField(max_length=32, verbose_name='action_type')
    need_remark = models.SmallIntegerField(verbose_name='need_remark', default=0)
    need_attachment = models.SmallIntegerField(verbose_name='need_attachment', default=0)
    need_confirm = models.SmallIntegerField(verbose_name='need_confirm', default=0)
    need_operator = models.SmallIntegerField(verbose_name='need_operator', default=1)
    status = models.CharField(max_length=32, verbose_name='status', default='ENABLED')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='created_at')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='updated_at')

    class Meta:
        db_table = 'wf_action'
        verbose_name = 'wf_action'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class WfTransition(models.Model):
    biz_type = models.CharField(max_length=32, verbose_name='biz_type')
    from_status_code = models.CharField(max_length=64, verbose_name='from_status_code')
    action_code = models.CharField(max_length=64, verbose_name='action_code')
    to_status_code = models.CharField(max_length=64, verbose_name='to_status_code')
    transition_type = models.CharField(max_length=32, verbose_name='transition_type')
    role_code = models.CharField(max_length=64, verbose_name='role_code', null=True, blank=True)
    is_system_only = models.SmallIntegerField(verbose_name='is_system_only', default=0)
    condition_expr = models.TextField(verbose_name='condition_expr', null=True, blank=True)
    condition_desc = models.CharField(max_length=255, verbose_name='condition_desc', null=True, blank=True)
    priority = models.IntegerField(verbose_name='priority', default=0)
    status = models.CharField(max_length=32, verbose_name='status', default='ENABLED')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='created_at')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='updated_at')

    class Meta:
        db_table = 'wf_transition'
        verbose_name = 'wf_transition'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class WfActionPermission(models.Model):
    biz_type = models.CharField(max_length=32, verbose_name='biz_type')
    status_code = models.CharField(max_length=64, verbose_name='status_code')
    action_code = models.CharField(max_length=64, verbose_name='action_code')
    role_code = models.CharField(max_length=64, verbose_name='role_code')
    allow_execute = models.SmallIntegerField(verbose_name='allow_execute', default=1)
    status = models.CharField(max_length=32, verbose_name='status', default='ENABLED')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='created_at')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='updated_at')

    class Meta:
        db_table = 'wf_action_permission'
        verbose_name = 'wf_action_permission'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class WfAutoRule(models.Model):
    biz_type = models.CharField(max_length=32, verbose_name='biz_type')
    rule_code = models.CharField(max_length=64, verbose_name='rule_code')
    from_status_code = models.CharField(max_length=64, verbose_name='from_status_code')
    action_code = models.CharField(max_length=64, verbose_name='action_code')
    trigger_mode = models.CharField(max_length=32, verbose_name='trigger_mode')
    trigger_expr = models.TextField(verbose_name='trigger_expr', null=True, blank=True)
    calendar_type = models.CharField(max_length=32, verbose_name='calendar_type', null=True, blank=True)
    is_holiday_excluded = models.SmallIntegerField(verbose_name='is_holiday_excluded', default=0)
    retryable = models.SmallIntegerField(verbose_name='retryable', default=1)
    status = models.CharField(max_length=32, verbose_name='status', default='ENABLED')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='created_at')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='updated_at')

    class Meta:
        db_table = 'wf_auto_rule'
        verbose_name = 'wf_auto_rule'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


