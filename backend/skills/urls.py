from django.urls import path
from .views import EmployeeSkillListCreateView, EmployeeSkillDetailView

urlpatterns = [
    path('skills/', EmployeeSkillListCreateView.as_view(), name='employee_skills_list'),
    path('skills/<str:pk>/', EmployeeSkillDetailView.as_view(), name='employee_skill_detail'),
]
