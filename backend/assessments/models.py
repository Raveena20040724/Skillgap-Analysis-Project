from django.db import models
from django.conf import settings
from skills.models import Skill

class Assessment(models.Model):
    title = models.CharField(max_length=200)
    skill = models.ForeignKey(Skill, on_delete=models.SET_NULL, null=True, blank=True, related_name='assessments')
    description = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=100, default='Programming')
    difficulty = models.CharField(max_length=50, default='Intermediate')
    duration_minutes = models.IntegerField(default=15)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.difficulty})"

class Question(models.Model):
    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    options = models.JSONField(default=list)  # List of strings e.g. ["Option A", "Option B", ...]
    correct_answer = models.IntegerField(default=0)  # Index of correct answer
    explanation = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Q: {self.question_text[:50]}"

class AssessmentResult(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='assessment_results')
    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE, related_name='results')
    score = models.IntegerField(default=0)
    accuracy = models.IntegerField(default=0)
    correct_answers = models.IntegerField(default=0)
    wrong_answers = models.IntegerField(default=0)
    strengths = models.JSONField(default=list, blank=True)
    weaknesses = models.JSONField(default=list, blank=True)
    attempted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.assessment.title}: {self.score}%"
