from django.contrib import admin
from .models import Skill, UserSkill

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'category', 'created_at')
    search_fields = ('name', 'category')
    list_filter = ('category',)

@admin.register(UserSkill)
class UserSkillAdmin(admin.ModelAdmin):
    list_display = ('user', 'skill', 'level', 'years_experience', 'proficiency_percentage', 'verified')
    search_fields = ('user__username', 'skill__name')
    list_filter = ('level', 'verified')
