from django.urls import path
from .views import SkillGapView, CareerRecommendationsView, LearningPathView

urlpatterns = [
    path('skill-gap/', SkillGapView.as_view(), name='employee_skill_gap'),
    path('career-recommendations/', CareerRecommendationsView.as_view(), name='employee_career_recommendations'),
    path('learning-path/', LearningPathView.as_view(), name='employee_learning_path'),
    path('learning-path/<int:step_id>/', LearningPathView.as_view(), name='employee_learning_path_step'),
]
