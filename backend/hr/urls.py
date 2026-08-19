from django.urls import path
from .views import HrOverviewView, TeamSkillGapsView, EmployeeDirectoryView, HrReportsView

urlpatterns = [
    path('overview/', HrOverviewView.as_view(), name='hr_overview'),
    path('team-skill-gaps/', TeamSkillGapsView.as_view(), name='hr_team_skill_gaps'),
    path('employees/', EmployeeDirectoryView.as_view(), name='hr_employee_directory'),
    path('directory/', EmployeeDirectoryView.as_view(), name='hr_directory_legacy'),
    path('reports/', HrReportsView.as_view(), name='hr_reports'),
]
