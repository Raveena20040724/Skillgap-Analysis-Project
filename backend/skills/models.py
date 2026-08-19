from django.db import models
from django.conf import settings

class Skill(models.Model):
    name = models.CharField(max_length=150, unique=True)
    category = models.CharField(max_length=100, default='Programming')
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.category})"

class UserSkill(models.Model):
    LEVEL_CHOICES = (
        ('Beginner', 'Beginner'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced'),
        ('Expert', 'Expert'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user_skills')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='user_levels')
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='Intermediate')
    years_experience = models.IntegerField(default=2)
    proficiency_percentage = models.IntegerField(default=70)
    verified = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'skill')

    def __str__(self):
        return f"{self.user.username} - {self.skill.name}: {self.level} ({self.proficiency_percentage}%)"
