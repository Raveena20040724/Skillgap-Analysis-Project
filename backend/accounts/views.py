from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from .models import CustomUser
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer, CreateHRSerializer
from .permissions import IsAdmin
from profiles.models import EmployeeProfile
from drf_spectacular.utils import extend_schema

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(request=RegisterSerializer)
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Ensure EmployeeProfile exists
            EmployeeProfile.objects.get_or_create(
                user=user,
                defaults={'location': 'San Francisco, CA', 'experience_years': 3}
            )
            refresh = RefreshToken.for_user(user)
            return Response({
                "success": True,
                "message": "User registered successfully",
                "data": {
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                    "user": UserSerializer(user).data
                }
            }, status=status.HTTP_201_CREATED)
        return Response({
            "success": False,
            "message": "Validation failed",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(request=LoginSerializer)
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            # Ensure EmployeeProfile exists for employees
            if user.role == 'employee':
                EmployeeProfile.objects.get_or_create(user=user)
            
            return Response({
                "success": True,
                "message": "Login successful",
                "data": {
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                    "user": UserSerializer(user).data
                }
            }, status=status.HTTP_200_OK)
        return Response({
            "success": False,
            "message": "Invalid username or password",
            "errors": serializer.errors
        }, status=status.HTTP_401_UNAUTHORIZED)

class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

class CreateHRView(APIView):
    permission_classes = [IsAdmin]

    @extend_schema(request=CreateHRSerializer)
    def post(self, request):
        serializer = CreateHRSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "success": True,
                "message": "HR account created successfully",
                "data": UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response({
            "success": False,
            "message": "Failed to create HR account",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

import random
from django.core.mail import send_mail
from django.conf import settings
from .models import PasswordResetOTP
from .serializers import SendOTPSerializer, VerifyChangePasswordSerializer
from django.utils import timezone
from datetime import timedelta

class SendOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(request=SendOTPSerializer)
    def post(self, request):
        serializer = SendOTPSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            user = CustomUser.objects.get(email__iexact=email)
            
            # Generate 6-digit OTP
            otp_code = str(random.randint(100000, 999999))
            
            # Save OTP to database
            PasswordResetOTP.objects.create(user=user, otp=otp_code)
            
            # Send email
            send_mail(
                subject='Your Password Reset OTP',
                message=f'Your OTP for password reset is: {otp_code}\nThis OTP is valid for 10 minutes.',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )
            
            return Response({
                "success": True,
                "message": "OTP sent successfully to your email."
            }, status=status.HTTP_200_OK)
        return Response({
            "success": False,
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

class VerifyChangePasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(request=VerifyChangePasswordSerializer)
    def post(self, request):
        serializer = VerifyChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            otp_input = serializer.validated_data['otp']
            new_password = serializer.validated_data['new_password']
            
            # Find a valid OTP (created within the last 10 minutes)
            time_threshold = timezone.now() - timedelta(minutes=10)
            valid_otp = PasswordResetOTP.objects.filter(
                user=user, 
                otp=otp_input, 
                created_at__gte=time_threshold
            ).first()
            
            if not valid_otp:
                return Response({
                    "success": False,
                    "message": "Invalid or expired OTP."
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # OTP is valid, change password
            user.set_password(new_password)
            user.save()
            
            # Delete all OTPs for this user to prevent reuse
            PasswordResetOTP.objects.filter(user=user).delete()
            
            return Response({
                "success": True,
                "message": "Password changed successfully."
            }, status=status.HTTP_200_OK)
        return Response({
            "success": False,
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
