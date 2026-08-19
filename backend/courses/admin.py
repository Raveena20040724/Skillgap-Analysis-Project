from django.contrib import admin
from .models import Course, UserCourse

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'provider', 'category', 'difficulty', 'duration_hours', 'created_at')
    search_fields = ('title', 'provider', 'category')

@admin.register(UserCourse)
class UserCourseAdmin(admin.ModelAdmin):
    list_display = ('user', 'course', 'progress_percentage', 'started_at', 'completed_at')
    search_fields = ('user__username', 'course__title')
