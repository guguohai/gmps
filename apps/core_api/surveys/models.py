from django.db import models
from django.utils import timezone


class SurveyTemplate(models.Model):
    id = models.BigAutoField(primary_key=True)
    template_no = models.CharField(max_length=64)
    template_name = models.CharField(max_length=200)
    template_desc = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=32, default='ENABLED')
    question_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'survey_template'
        constraints = [
            models.UniqueConstraint(fields=['template_no'], name='uk_survey_template_template_no'),
        ]
        verbose_name = 'survey_template'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class SurveyTemplateQuestion(models.Model):
    id = models.BigAutoField(primary_key=True)
    template = models.ForeignKey('SurveyTemplate', on_delete=models.DO_NOTHING, related_name='+', db_index=False)
    sort_no = models.IntegerField(default=0)
    question_no = models.CharField(max_length=64)
    question_title = models.CharField(max_length=200)
    question_type = models.CharField(max_length=32)
    is_required = models.SmallIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'survey_template_question'
        constraints = [
            models.UniqueConstraint(fields=['template', 'question_no'], name='uk_survey_template_question_template_question_no'),
        ]
        indexes = [
            models.Index(fields=['template', 'sort_no'], name='idx_survey_template_question_template_sort'),
        ]
        verbose_name = 'survey_template_question'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class SurveyTemplateOption(models.Model):
    id = models.BigAutoField(primary_key=True)
    question = models.ForeignKey('SurveyTemplateQuestion', on_delete=models.DO_NOTHING, related_name='+', db_index=False)
    sort_no = models.IntegerField(default=0)
    option_no = models.CharField(max_length=64)
    option_text = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'survey_template_option'
        constraints = [
            models.UniqueConstraint(fields=['question', 'option_no'], name='uk_survey_template_option_question_option_no'),
        ]
        indexes = [
            models.Index(fields=['question', 'sort_no'], name='idx_survey_template_option_question_sort'),
        ]
        verbose_name = 'survey_template_option'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class SurveyTask(models.Model):
    id = models.BigAutoField(primary_key=True)
    survey_no = models.CharField(max_length=64)
    ticket = models.ForeignKey('tickets.Ticket', on_delete=models.DO_NOTHING, related_name='+', db_index=False)
    template = models.ForeignKey('SurveyTemplate', on_delete=models.DO_NOTHING, related_name='+', db_index=False, null=True, blank=True)
    survey_title = models.CharField(max_length=200, null=True, blank=True)
    survey_desc = models.TextField(null=True, blank=True)
    survey_status = models.CharField(max_length=32)
    deadline_at = models.DateTimeField(null=True, blank=True)
    allow_submit = models.SmallIntegerField(default=1)
    question_count = models.IntegerField(default=0)
    submitted_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'survey_task'
        constraints = [
            models.UniqueConstraint(fields=['survey_no'], name='uk_survey_task_survey_no'),
        ]
        indexes = [
            models.Index(fields=['ticket', 'survey_status'], name='idx_survey_task_ticket_status'),
        ]
        verbose_name = 'survey_task'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class SurveyAnswer(models.Model):
    id = models.BigAutoField(primary_key=True)
    survey_task = models.ForeignKey('SurveyTask', on_delete=models.DO_NOTHING, related_name='+', db_index=False)
    question = models.ForeignKey('SurveyTemplateQuestion', on_delete=models.DO_NOTHING, related_name='+', db_index=False)
    question_no = models.CharField(max_length=64)
    question_title = models.CharField(max_length=200)
    question_type = models.CharField(max_length=32)
    answer_option_no = models.CharField(max_length=64, null=True, blank=True)
    answer_option_text = models.CharField(max_length=200, null=True, blank=True)
    answer_score = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    answer_text = models.TextField(null=True, blank=True)
    submitted_at = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'survey_answer'
        indexes = [
            models.Index(fields=['survey_task'], name='idx_survey_answer_task_id'),
            models.Index(fields=['question'], name='idx_survey_answer_question_id'),
        ]
        verbose_name = 'survey_answer'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)
