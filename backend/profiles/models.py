from django.db import models
from django.conf import settings

class EmployeeProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='employee_profile')
    phone = models.CharField(max_length=30, blank=True, null=True)
    location = models.CharField(max_length=150, default='San Francisco, CA')
    experience_years = models.IntegerField(default=3)
    education = models.TextField(blank=True, null=True)
    bio = models.TextField(blank=True, null=True, default='Passionate Web Architect & Developer.')
    linkedin = models.URLField(max_length=500, blank=True, null=True)
    github = models.URLField(max_length=500, blank=True, null=True)
    portfolio = models.URLField(max_length=500, blank=True, null=True)
    readiness_score = models.IntegerField(default=84)
    resume_completion_score = models.IntegerField(default=90)
    profile_completion_score = models.IntegerField(default=85)
    certifications_json = models.JSONField(default=list, blank=True)
    projects_json = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile of {self.user.username}"

class WorkExperience(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='work_experiences')
    role = models.CharField(max_length=150)
    company = models.CharField(max_length=150)
    duration = models.CharField(max_length=100, blank=True, null=True, default='2023 - Present')
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    is_current = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.role} at {self.company}"
