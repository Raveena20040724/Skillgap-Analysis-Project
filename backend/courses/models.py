from django.db import models
from django.conf import settings

class Course(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    provider = models.CharField(max_length=100, default='SkillGap Learning')
    provider_url = models.URLField(max_length=500, blank=True, null=True)
    category = models.CharField(max_length=100, default='Programming')
    difficulty = models.CharField(max_length=50, default='Intermediate')
    duration_hours = models.IntegerField(default=12)
    thumbnail = models.URLField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.provider})"

class UserCourse(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='enrolled_courses')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='user_enrollments')
    progress_percentage = models.IntegerField(default=0)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        unique_together = ('user', 'course')

    def __str__(self):
        return f"{self.user.username} - {self.course.title}: {self.progress_percentage}%"
