from django.urls import path
from .views import ResumeView

urlpatterns = [
    path('resume/', ResumeView.as_view(), name='employee_resume'),
]
