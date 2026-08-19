from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Course, UserCourse
from .serializers import CourseSerializer, UserCourseSerializer

DEFAULT_COURSES = [
    {
        "id": 1,
        "title": "Modern TypeScript Design Patterns & Architecture",
        "provider": "Meta / Coursera",
        "category": "Programming",
        "difficulty": "Advanced",
        "duration_hours": 18,
        "description": "Master advanced TypeScript generics, union discriminants, AST transformations, and clean code principles."
    },
    {
        "id": 2,
        "title": "Enterprise Micro-Frontends & Module Federation",
        "provider": "Frontend Masters",
        "category": "Web Architecture",
        "difficulty": "Advanced",
        "duration_hours": 24,
        "description": "Decompose monolithic single-page applications into high-performance micro-frontend ecosystems."
    },
    {
        "id": 3,
        "title": "Full-Stack System Design & Web Performance Optimization",
        "provider": "Udacity Nanodegree",
        "category": "System Design",
        "difficulty": "Expert",
        "duration_hours": 32,
        "description": "Optimize Core Web Vitals, browser rendering pipelines, HTTP/3 caching, and edge computing worker nodes."
    }
]

class CourseListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        courses = Course.objects.all()
        if not courses.exists():
            for c_data in DEFAULT_COURSES:
                Course.objects.get_or_create(
                    title=c_data['title'],
                    defaults=c_data
                )
            courses = Course.objects.all()

        serializer = CourseSerializer(courses, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

class EnrollCourseView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            course = Course.objects.get(pk=pk)
        except Course.DoesNotExist:
            return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

        user_course, created = UserCourse.objects.get_or_create(
            user=request.user,
            course=course,
            defaults={'progress_percentage': 0}
        )

        if not created:
            return Response({"message": "Already enrolled in this course"}, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            "success": True,
            "message": "Enrolled successfully",
            "data": UserCourseSerializer(user_course).data
        }, status=status.HTTP_201_CREATED)

class UpdateProgressView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        progress = request.data.get('progress_percentage') or request.data.get('progress', 0)
        progress = max(0, min(100, int(progress)))

        try:
            user_course = UserCourse.objects.get(pk=pk, user=request.user)
        except UserCourse.DoesNotExist:
            return Response({"error": "Enrollment record not found"}, status=status.HTTP_404_NOT_FOUND)

        user_course.progress_percentage = progress
        if progress == 100 and not user_course.completed_at:
            user_course.completed_at = timezone.now()
        user_course.save()

        return Response({
            "success": True,
            "message": "Course progress updated",
            "data": UserCourseSerializer(user_course).data
        }, status=status.HTTP_200_OK)

class ProgressAnalyticsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response({
            "weekly_learning_hours": [
                {"day": "Mon", "hours": 2.5},
                {"day": "Tue", "hours": 4.0},
                {"day": "Wed", "hours": 3.2},
                {"day": "Thu", "hours": 5.0},
                {"day": "Fri", "hours": 4.5},
                {"day": "Sat", "hours": 6.0},
                {"day": "Sun", "hours": 3.0}
            ],
            "skill_growth": [
                {"month": "Jan", "score": 62},
                {"month": "Feb", "score": 68},
                {"month": "Mar", "score": 75},
                {"month": "Apr", "score": 84}
            ],
            "course_progress": [
                {"title": "Modern TypeScript Design Patterns", "progress": 100},
                {"title": "Redux Toolkit & Zustand Mastery", "progress": 100},
                {"title": "Module Federation & Micro-frontends", "progress": 65},
                {"title": "Client-Side AI & Vector Embeddings", "progress": 25}
            ],
            "assessment_history": [
                {"assessment": "TypeScript Benchmark", "score": 88, "date": "2026-02-15"},
                {"assessment": "React Architecture Exam", "score": 92, "date": "2026-03-01"}
            ]
        }, status=status.HTTP_200_OK)
