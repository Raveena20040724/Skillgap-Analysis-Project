from django.contrib import admin
from .models import EmployeeProfile, WorkExperience

@admin.register(EmployeeProfile)
class EmployeeProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'location', 'experience_years', 'readiness_score', 'created_at')
    search_fields = ('user__username', 'user__email', 'location')

@admin.register(WorkExperience)
class WorkExperienceAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'company', 'duration', 'is_current')
    search_fields = ('user__username', 'role', 'company')
