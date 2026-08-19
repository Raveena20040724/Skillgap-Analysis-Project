from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, LoginView, CurrentUserView, CreateHRView, SendOTPView, VerifyChangePasswordView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', LoginView.as_view(), name='auth_login'),
    path('login/refresh/', TokenRefreshView.as_view(), name='auth_refresh'),
    path('me/', CurrentUserView.as_view(), name='auth_me'),
    path('create-hr/', CreateHRView.as_view(), name='auth_create_hr'),
    path('send-otp/', SendOTPView.as_view(), name='send_otp'),
    path('verify-change-password/', VerifyChangePasswordView.as_view(), name='verify_change_password'),
]
