from django.db import models


class WfStatus(models.Model):
    id = models.BigAutoField(primary_key=True)
    biz_type = models.CharField(max_length=32)
    status_code = models.CharField(max_length=64)
    status_name = models.CharField(max_length=100)
    status_name_en = models.CharField(max_length=100, null=True, blank=True)
    status_name_ko = models.CharField(max_length=100, null=True, blank=True)
    status_level = models.CharField(max_length=32)
    main_status_code = models.CharField(max_length=64, null=True, blank=True)
    customer_status_code = models.CharField(max_length=64, null=True, blank=True)
    progress_node_code = models.CharField(max_length=64, null=True, blank=True)
    is_initial = models.SmallIntegerField(default=0)
    is_final = models.SmallIntegerField(default=0)
    is_system_only = models.SmallIntegerField(default=0)
    allow_manual_set = models.SmallIntegerField(default=0)
    sort_no = models.IntegerField(default=0)
    status = models.CharField(max_length=32, default='ENABLED')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'wf_status'
        constraints = [
            models.UniqueConstraint(fields=['biz_type', 'status_code'], name='uk_wf_status_biz_type_status_code'),
        ]
        indexes = [
            models.Index(fields=['biz_type', 'status_level', 'sort_no'], name='idx_wf_status_level_sort'),
        ]
        verbose_name = 'wf_status'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class WfAction(models.Model):
    id = models.BigAutoField(primary_key=True)
    biz_type = models.CharField(max_length=32)
    action_code = models.CharField(max_length=64)
    action_name = models.CharField(max_length=100)
    action_type = models.CharField(max_length=32)
    need_remark = models.SmallIntegerField(default=0)
    need_attachment = models.SmallIntegerField(default=0)
    need_confirm = models.SmallIntegerField(default=0)
    need_operator = models.SmallIntegerField(default=1)
    status = models.CharField(max_length=32, default='ENABLED')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'wf_action'
        constraints = [
            models.UniqueConstraint(fields=['biz_type', 'action_code'], name='uk_wf_action_biz_type_action_code'),
        ]
        verbose_name = 'wf_action'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class WfTransition(models.Model):
    id = models.BigAutoField(primary_key=True)
    biz_type = models.CharField(max_length=32)
    from_status_code = models.CharField(max_length=64)
    action_code = models.CharField(max_length=64)
    to_status_code = models.CharField(max_length=64)
    transition_type = models.CharField(max_length=32)
    role_code = models.CharField(max_length=64, null=True, blank=True)
    is_system_only = models.SmallIntegerField(default=0)
    condition_expr = models.TextField(null=True, blank=True)
    condition_desc = models.CharField(max_length=255, null=True, blank=True)
    priority = models.IntegerField(default=0)
    status = models.CharField(max_length=32, default='ENABLED')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'wf_transition'
        constraints = [
            models.UniqueConstraint(fields=['biz_type', 'from_status_code', 'action_code', 'to_status_code'], name='uk_wf_transition_core'),
        ]
        indexes = [
            models.Index(fields=['biz_type', 'from_status_code', 'action_code', 'priority'], name='idx_wf_transition_from_action_priority'),
        ]
        verbose_name = 'wf_transition'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class WfActionPermission(models.Model):
    id = models.BigAutoField(primary_key=True)
    biz_type = models.CharField(max_length=32)
    status_code = models.CharField(max_length=64)
    action_code = models.CharField(max_length=64)
    role_code = models.CharField(max_length=64)
    allow_execute = models.SmallIntegerField(default=1)
    status = models.CharField(max_length=32, default='ENABLED')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'wf_action_permission'
        constraints = [
            models.UniqueConstraint(fields=['biz_type', 'status_code', 'action_code', 'role_code'], name='uk_wf_action_permission_core'),
        ]
        verbose_name = 'wf_action_permission'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class WfAutoRule(models.Model):
    id = models.BigAutoField(primary_key=True)
    biz_type = models.CharField(max_length=32)
    rule_code = models.CharField(max_length=64)
    from_status_code = models.CharField(max_length=64)
    action_code = models.CharField(max_length=64)
    trigger_mode = models.CharField(max_length=32)
    trigger_expr = models.TextField(null=True, blank=True)
    calendar_type = models.CharField(max_length=32, null=True, blank=True)
    is_holiday_excluded = models.SmallIntegerField(default=0)
    retryable = models.SmallIntegerField(default=1)
    status = models.CharField(max_length=32, default='ENABLED')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'wf_auto_rule'
        constraints = [
            models.UniqueConstraint(fields=['biz_type', 'rule_code'], name='uk_wf_auto_rule_biz_type_rule_code'),
        ]
        indexes = [
            models.Index(fields=['biz_type', 'from_status_code', 'trigger_mode'], name='idx_wf_auto_rule_from_status_mode'),
        ]
        verbose_name = 'wf_auto_rule'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)
