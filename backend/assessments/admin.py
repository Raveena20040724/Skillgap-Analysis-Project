from django.contrib import admin
from .models import Assessment, Question, AssessmentResult

class QuestionInline(admin.TabularInline):
    model = Question
    extra = 1

@admin.register(Assessment)
class AssessmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'category', 'difficulty', 'duration_minutes', 'created_at')
    search_fields = ('title', 'category')
    inlines = [QuestionInline]

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('id', 'assessment', 'question_text', 'correct_answer')
    search_fields = ('question_text',)

@admin.register(AssessmentResult)
class AssessmentResultAdmin(admin.ModelAdmin):
    list_display = ('user', 'assessment', 'score', 'accuracy', 'attempted_at')
    search_fields = ('user__username', 'assessment__title')
