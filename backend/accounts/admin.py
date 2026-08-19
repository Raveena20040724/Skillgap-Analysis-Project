from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('id', 'username', 'email', 'role', 'department', 'is_active', 'created_at')
    list_filter = ('role', 'department', 'is_active')
    search_fields = ('username', 'email', 'department', 'designation')
    fieldsets = UserAdmin.fieldsets + (
        ('Role & Company Telemetry', {'fields': ('role', 'department', 'designation', 'phone', 'avatar')}),
    )
