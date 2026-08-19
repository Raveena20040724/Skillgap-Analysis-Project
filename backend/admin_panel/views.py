from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from accounts.models import CustomUser
from accounts.permissions import IsAdmin
from .serializers import AdminUserManagementSerializer

class AdminStatsView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        total_users = CustomUser.objects.count()
        total_hrs = CustomUser.objects.filter(role='hr').count()
        total_employees = CustomUser.objects.filter(role='employee').count()

        return Response({
            "total_users": total_users,
            "active_hrs": total_hrs,
            "total_employees": total_employees,
            "total_departments": 6,
            "system_health": "99.9% Uptime",
            "active_sessions": 42
        }, status=status.HTTP_200_OK)

class AdminUserListCreateView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        users = CustomUser.objects.all().order_by('-created_at')
        serializer = AdminUserManagementSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data
        username = data.get('username') or data.get('email', '').split('@')[0]
        email = data.get('email')
        password = data.get('password', 'DefaultPass123!')
        role = data.get('role', 'employee')
        department = data.get('department', 'Engineering')

        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        user = CustomUser.objects.create_user(
            username=username,
            email=email,
            password=password,
            role=role,
            department=department
        )

        serializer = AdminUserManagementSerializer(user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class AdminUserDetailView(APIView):
    permission_classes = [IsAdmin]

    def patch(self, request, pk):
        try:
            user = CustomUser.objects.get(pk=pk)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        if 'status' in request.data:
            status_val = str(request.data['status']).lower()
            user.is_active = (status_val in ['active', 'true', '1'])
        if 'is_active' in request.data:
            user.is_active = bool(request.data['is_active'])
        if 'role' in request.data:
            user.role = request.data['role']
        if 'department' in request.data:
            user.department = request.data['department']
        user.save()

        serializer = AdminUserManagementSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        try:
            user = CustomUser.objects.get(pk=pk)
            user.delete()
            return Response({"message": "User deleted successfully"}, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
