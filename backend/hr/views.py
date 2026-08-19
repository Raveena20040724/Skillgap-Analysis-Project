from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from accounts.models import CustomUser
from accounts.permissions import IsHROrAdmin
from .serializers import EmployeeDirectorySerializer

class HrOverviewView(APIView):
    permission_classes = [IsHROrAdmin]

    def get(self, request):
        total_workforce = CustomUser.objects.filter(role='employee').count() or 342
        return Response({
            "total_workforce": total_workforce,
            "avg_readiness": 83.4,
            "identified_skill_gaps": 48,
            "active_learning_courses": 156,
            "department_readiness": [
                {"department": "Engineering", "readiness": 88},
                {"department": "Product", "readiness": 84},
                {"department": "Design", "readiness": 78},
                {"department": "DevOps", "readiness": 92},
                {"department": "Data Science", "readiness": 81}
            ],
            "taxonomy_distribution": [
                {"name": "Frontend", "value": 35, "color": "#3b82f6"},
                {"name": "Backend", "value": 25, "color": "#10b981"},
                {"name": "Cloud/DevOps", "value": 20, "color": "#6366f1"},
                {"name": "AI/ML", "value": 12, "color": "#f59e0b"},
                {"name": "UI/UX", "value": 8, "color": "#06b6d4"}
            ]
        }, status=status.HTTP_200_OK)

class TeamSkillGapsView(APIView):
    permission_classes = [IsHROrAdmin]

    def get(self, request):
        return Response([
            {"team": "Frontend Team", "skill": "Micro-frontends", "gap_score": 35},
            {"team": "Backend Team", "skill": "FastAPI & AsyncIO", "gap_score": 28},
            {"team": "DevOps Team", "skill": "Kubernetes Ingress", "gap_score": 18},
            {"team": "Data Science", "skill": "LLM Fine-Tuning", "gap_score": 42}
        ], status=status.HTTP_200_OK)

class EmployeeDirectoryView(APIView):
    permission_classes = [IsHROrAdmin]

    def get(self, request):
        department = request.query_params.get('department')
        search = request.query_params.get('search')
        skill = request.query_params.get('skill')

        employees = CustomUser.objects.filter(role='employee').select_related('employee_profile')

        if department and department != 'All':
            employees = employees.filter(department__icontains=department)
        if search:
            employees = employees.filter(username__icontains=search) | employees.filter(email__icontains=search) | employees.filter(designation__icontains=search)

        serializer = EmployeeDirectorySerializer(employees, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class HrReportsView(APIView):
    permission_classes = [IsHROrAdmin]

    def get(self, request):
        return Response({
            "workforce_readiness_index": 83.4,
            "top_skills": ["React.js", "Python", "PostgreSQL", "Tailwind CSS"],
            "most_common_missing_skills": ["Micro-frontends", "AWS Cloud Infrastructure", "Docker CI/CD"],
            "assessment_completion_rate": "92%"
        }, status=status.HTTP_200_OK)
