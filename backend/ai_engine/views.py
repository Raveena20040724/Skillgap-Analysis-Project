from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .services import calculate_skill_gap, get_career_recommendations, get_learning_path

class SkillGapView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        result = calculate_skill_gap(request.user)
        # Frontend expects either the array directly or structured data
        return Response(result['gap_matrix'], status=status.HTTP_200_OK)

class CareerRecommendationsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        recommendations = get_career_recommendations(request.user)
        return Response(recommendations, status=status.HTTP_200_OK)

class LearningPathView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        path_data = get_learning_path(request.user)
        return Response(path_data, status=status.HTTP_200_OK)

    def patch(self, request, step_id=None):
        status_val = request.data.get('status', 'completed')
        return Response({
            "success": True,
            "message": f"Step {step_id} updated to {status_val}"
        }, status=status.HTTP_200_OK)
