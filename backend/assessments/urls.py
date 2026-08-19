from django.urls import path
from .views import QuestionsView, SubmitAssessmentView

urlpatterns = [
    path('assessment/questions/', QuestionsView.as_view(), name='assessment_questions'),
    path('assessment/submit/', SubmitAssessmentView.as_view(), name='assessment_submit'),
]
