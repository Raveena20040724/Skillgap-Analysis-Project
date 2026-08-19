from django.urls import path
from .views import ProfileView, ExperienceListCreateView, ExperienceDetailView

urlpatterns = [
    path('profile/', ProfileView.as_view(), name='employee_profile'),
    path('experience/', ExperienceListCreateView.as_view(), name='employee_experience_list'),
    path('experience/<int:pk>/', ExperienceDetailView.as_view(), name='employee_experience_detail'),
]
