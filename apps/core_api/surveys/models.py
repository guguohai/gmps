from django.db import models

class SurveyTemplate(models.Model):
    template_no = models.CharField(max_length=64, verbose_name='template_no')
    template_name = models.CharField(max_length=200, verbose_name='template_name')
    template_desc = models.TextField(verbose_name='template_desc', null=True, blank=True)
    status = models.CharField(max_length=32, verbose_name='status', default='ENABLED')
    question_count = models.IntegerField(verbose_name='question_count', default=0)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='created_at')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='updated_at')

    class Meta:
        db_table = 'survey_template'
        verbose_name = 'survey_template'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class SurveyTemplateQuestion(models.Model):
    template_id = models.BigIntegerField(verbose_name='template_id')
    sort_no = models.IntegerField(verbose_name='sort_no', default=0)
    question_no = models.CharField(max_length=64, verbose_name='question_no')
    question_title = models.CharField(max_length=200, verbose_name='question_title')
    question_type = models.CharField(max_length=32, verbose_name='question_type')
    is_required = models.SmallIntegerField(verbose_name='is_required', default=1)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='created_at')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='updated_at')

    class Meta:
        db_table = 'survey_template_question'
        verbose_name = 'survey_template_question'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class SurveyTemplateOption(models.Model):
    question_id = models.BigIntegerField(verbose_name='question_id')
    sort_no = models.IntegerField(verbose_name='sort_no', default=0)
    option_no = models.CharField(max_length=64, verbose_name='option_no')
    option_text = models.CharField(max_length=200, verbose_name='option_text')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='created_at')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='updated_at')

    class Meta:
        db_table = 'survey_template_option'
        verbose_name = 'survey_template_option'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class SurveyTask(models.Model):
    survey_no = models.CharField(max_length=64, verbose_name='survey_no')
    ticket = models.ForeignKey('tickets.Ticket', on_delete=models.SET_NULL if False else models.CASCADE, verbose_name='ticket_id')
    template_id = models.BigIntegerField(verbose_name='template_id', null=True, blank=True)
    survey_title = models.CharField(max_length=200, verbose_name='survey_title', null=True, blank=True)
    survey_desc = models.TextField(verbose_name='survey_desc', null=True, blank=True)
    survey_status = models.CharField(max_length=32, verbose_name='survey_status')
    deadline_at = models.DateTimeField(verbose_name='deadline_at', null=True, blank=True)
    allow_submit = models.SmallIntegerField(verbose_name='allow_submit', default=1)
    question_count = models.IntegerField(verbose_name='question_count', default=0)
    submitted_at = models.DateTimeField(verbose_name='submitted_at', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='created_at')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='updated_at')

    class Meta:
        db_table = 'survey_task'
        verbose_name = 'survey_task'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


class SurveyAnswer(models.Model):
    survey_task = models.ForeignKey('SurveyTask', on_delete=models.SET_NULL if False else models.CASCADE, verbose_name='survey_task_id')
    question_id = models.BigIntegerField(verbose_name='question_id')
    question_no = models.CharField(max_length=64, verbose_name='question_no')
    question_title = models.CharField(max_length=200, verbose_name='question_title')
    question_type = models.CharField(max_length=32, verbose_name='question_type')
    answer_option_no = models.CharField(max_length=64, verbose_name='answer_option_no', null=True, blank=True)
    answer_option_text = models.CharField(max_length=200, verbose_name='answer_option_text', null=True, blank=True)
    answer_score = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='answer_score', null=True, blank=True)
    answer_text = models.TextField(verbose_name='answer_text', null=True, blank=True)
    submitted_at = models.DateTimeField(verbose_name='submitted_at')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='created_at')

    class Meta:
        db_table = 'survey_answer'
        verbose_name = 'survey_answer'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)


