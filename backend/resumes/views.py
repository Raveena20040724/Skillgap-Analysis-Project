import logging
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema, OpenApiTypes, OpenApiParameter
from .models import Resume
from .serializers import ResumeSerializer, ResumeUploadSerializer
from .ai_parser import parse_resume_with_grok

logger = logging.getLogger(__name__)


class ResumeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            resume = Resume.objects.get(user=request.user)
            serializer = ResumeSerializer(resume)
            return Response({
                "exists": True,
                "data": serializer.data
            }, status=status.HTTP_200_OK)
        except Resume.DoesNotExist:
            return Response({
                "exists": False,
                "message": "No resume uploaded yet",
                "data": None
            }, status=status.HTTP_200_OK)

    @extend_schema(
        request={
            'multipart/form-data': {
                'type': 'object',
                'properties': {
                    'file': {'type': 'string', 'format': 'binary'}
                },
                'required': ['file']
            }
        }
    )
    def post(self, request):
        upload_data = request.data.copy() if hasattr(request.data, 'copy') else dict(request.data)
        if 'file' not in upload_data and 'resume' in upload_data:
            upload_data['file'] = upload_data['resume']
        if 'file' not in request.FILES and 'resume' in request.FILES:
            upload_data['file'] = request.FILES['resume']

        serializer = ResumeUploadSerializer(data=upload_data)
        if serializer.is_valid():
            # Save file & create or update resume record
            resume, _ = Resume.objects.get_or_create(user=request.user)

            # Delete old file if re-uploading
            if resume.file:
                try:
                    resume.file.delete(save=False)
                except Exception as e:
                    logger.warning(f"Failed to delete old file: {e}")

            resume.file = serializer.validated_data['file']
            resume.status = 'processing'
            resume.save()

            # Async or synchronous AI Resume Parsing
            try:
                parsed_data = parse_resume_with_grok(resume.file.path)
                resume.parsed_skills_json = parsed_data.get('skills', [])
                resume.extracted_experience_json = parsed_data.get('experience', [])
                resume.status = 'completed'
                resume.save()
            except Exception as e:
                logger.error(f"Error parsing resume with AI: {e}")
                resume.status = 'failed'
                resume.save()

            return Response(ResumeSerializer(resume).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        try:
            resume = Resume.objects.get(user=request.user)
            if resume.file:
                resume.file.delete(save=False)
            resume.delete()
            return Response({"success": True, "message": "Resume deleted successfully"}, status=status.HTTP_200_OK)
        except Resume.DoesNotExist:
            return Response({"success": True, "message": "Resume record cleared"}, status=status.HTTP_200_OK)
