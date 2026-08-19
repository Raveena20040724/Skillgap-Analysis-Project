from django.urls import path
from .views import AdminStatsView, AdminUserListCreateView, AdminUserDetailView

urlpatterns = [
    path('stats/', AdminStatsView.as_view(), name='admin_stats'),
    path('users/', AdminUserListCreateView.as_view(), name='admin_users_list'),
    path('users/<int:pk>/', AdminUserDetailView.as_view(), name='admin_users_detail'),
]
