from django.contrib import admin
from .models import Resume

@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ('user', 'file', 'status', 'uploaded_at')
    list_filter = ('status',)
    search_fields = ('user__username', 'user__email')
