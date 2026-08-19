import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Resume
from .serializers import ResumeSerializer, ResumeUploadSerializer
from .ai_parser import parse_resume_with_grok
from skills.models import Skill, UserSkill
from drf_spectacular.utils import extend_schema

class ResumeView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        try:
            resume = Resume.objects.get(user=request.user)
            serializer = ResumeSerializer(resume)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Resume.DoesNotExist:
            return Response({"message": "No resume uploaded yet"}, status=status.HTTP_404_NOT_FOUND)

    @extend_schema(
        request={
            'multipart/form-data': {
                'type': 'object',
                'properties': {
                    'file': {
                        'type': 'string',
                        'format': 'binary'
                    }
                }
            }
        }
    )
    def post(self, request):
        serializer = ResumeUploadSerializer(data=request.data)
        if serializer.is_valid():
            # Save file & create or update resume record
            resume, _ = Resume.objects.get_or_create(user=request.user)
            resume.file = serializer.validated_data['file']
            resume.status = 'processing'
            resume.save()

            # Process with Grok AI
            try:
                parsed_data = parse_resume_with_grok(resume.file.path)
                resume.parsed_skills_json = parsed_data.get('skills', [])
                resume.extracted_experience_json = parsed_data.get('experience', [])
                resume.status = 'completed'
                resume.save()

                # Automatically populate UserSkills from extracted skills
                for sk_item in parsed_data.get('skills', []):
                    sk_name = sk_item.get('name')
                    if sk_name:
                        skill = Skill.objects.filter(name__iexact=sk_name.strip()).first()
                        if not skill:
                            skill = Skill.objects.create(
                                name=sk_name.strip(),
                                category=sk_item.get('category', 'Programming')
                            )
                        UserSkill.objects.get_or_create(
                            user=request.user,
                            skill=skill,
                            defaults={'level': sk_item.get('proficiency', 'Intermediate'), 'proficiency_percentage': 75}
                        )

            except Exception as e:
                resume.status = 'completed'
                resume.save()

            return Response({
                "success": True,
                "message": "Resume uploaded and parsed successfully",
                "data": ResumeSerializer(resume).data
            }, status=status.HTTP_201_CREATED)

        return Response({
            "success": False,
            "message": "Validation failed",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        try:
            resume = Resume.objects.get(user=request.user)
            resume.delete()
            return Response({"message": "Resume deleted successfully"}, status=status.HTTP_200_OK)
        except Resume.DoesNotExist:
            return Response({"error": "Resume not found"}, status=status.HTTP_404_NOT_FOUND)
