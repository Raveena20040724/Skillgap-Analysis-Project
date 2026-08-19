from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import EmployeeProfile, WorkExperience
from .serializers import ProfileSerializer, WorkExperienceSerializer
from drf_spectacular.utils import extend_schema

class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile, _ = EmployeeProfile.objects.get_or_create(user=request.user)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(request=ProfileSerializer)
    def put(self, request):
        profile, _ = EmployeeProfile.objects.get_or_create(user=request.user)
        
        # Update user fields if provided
        user = request.user
        if 'name' in request.data:
            names = request.data['name'].split(' ', 1)
            user.first_name = names[0]
            if len(names) > 1:
                user.last_name = names[1]
        if 'department' in request.data:
            user.department = request.data['department']
        if 'designation' in request.data:
            user.designation = request.data['designation']
        if 'phone' in request.data:
            user.phone = request.data['phone']
        if 'avatar' in request.data:
            user.avatar = request.data['avatar']
        user.save()

        # Update profile fields
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "Profile updated successfully",
                "data": serializer.data
            }, status=status.HTTP_200_OK)
        return Response({
            "success": False,
            "message": "Validation failed",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

class ExperienceListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        experiences = WorkExperience.objects.filter(user=request.user)
        serializer = WorkExperienceSerializer(experiences, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(request=WorkExperienceSerializer)
    def post(self, request):
        serializer = WorkExperienceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ExperienceDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(request=WorkExperienceSerializer)
    def put(self, request, pk):
        try:
            experience = WorkExperience.objects.get(pk=pk, user=request.user)
        except WorkExperience.DoesNotExist:
            return Response({"error": "Experience not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = WorkExperienceSerializer(experience, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            experience = WorkExperience.objects.get(pk=pk, user=request.user)
            experience.delete()
            return Response({"message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except WorkExperience.DoesNotExist:
            return Response({"error": "Experience not found"}, status=status.HTTP_404_NOT_FOUND)
