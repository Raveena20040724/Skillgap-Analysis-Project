from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Skill, UserSkill
from .serializers import UserSkillSerializer, SkillSerializer

class EmployeeSkillListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user_skills = UserSkill.objects.filter(user=request.user).select_related('skill')
        serializer = UserSkillSerializer(user_skills, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data
        skill_name = data.get('name') or data.get('skill_name')
        category = data.get('category', 'Programming')
        level = data.get('level', 'Intermediate')
        years_exp = data.get('yearsOfExperience') or data.get('years_experience', 2)
        prof_pct = data.get('proficiencyPercentage') or data.get('proficiency_percentage', 70)
        verified = data.get('verified', True)

        if not skill_name:
            return Response({"error": "Skill name is required"}, status=status.HTTP_400_BAD_REQUEST)

        skill, _ = Skill.objects.get_or_create(
            name__iexact=skill_name.strip(),
            defaults={'name': skill_name.strip(), 'category': category}
        )

        user_skill, created = UserSkill.objects.get_or_create(
            user=request.user,
            skill=skill,
            defaults={
                'level': level,
                'years_experience': years_exp,
                'proficiency_percentage': prof_pct,
                'verified': verified
            }
        )

        if not created:
            # Prevent duplicate error, update existing
            user_skill.level = level
            user_skill.years_experience = years_exp
            user_skill.proficiency_percentage = prof_pct
            user_skill.verified = verified
            user_skill.save()

        serializer = UserSkillSerializer(user_skill)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

class EmployeeSkillDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, pk):
        try:
            user_skill = UserSkill.objects.get(pk=pk, user=request.user)
        except (UserSkill.DoesNotExist, ValueError):
            return Response({"error": "Skill not found"}, status=status.HTTP_404_NOT_FOUND)

        data = request.data
        if 'level' in data:
            user_skill.level = data['level']
        if 'yearsOfExperience' in data or 'years_experience' in data:
            user_skill.years_experience = data.get('yearsOfExperience') or data.get('years_experience')
        if 'proficiencyPercentage' in data or 'proficiency_percentage' in data:
            user_skill.proficiency_percentage = data.get('proficiencyPercentage') or data.get('proficiency_percentage')
        if 'verified' in data:
            user_skill.verified = data['verified']
        user_skill.save()

        serializer = UserSkillSerializer(user_skill)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        try:
            user_skill = UserSkill.objects.get(pk=pk, user=request.user)
            user_skill.delete()
            return Response({"message": "Skill deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except (UserSkill.DoesNotExist, ValueError):
            return Response({"error": "Skill not found"}, status=status.HTTP_404_NOT_FOUND)
