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
