import os
from rest_framework import serializers
from .models import Resume

ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx']
MAX_FILE_SIZE_MB = 10

class ResumeUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = ['file']

    def validate_file(self, value):
        ext = os.path.splitext(value.name)[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise serializers.ValidationError("Unsupported file extension. Only PDF, DOC, and DOCX files are allowed.")
        if value.size > MAX_FILE_SIZE_MB * 1024 * 1024:
            raise serializers.ValidationError(f"File size exceeds maximum limit of {MAX_FILE_SIZE_MB}MB.")
        return value

class ResumeSerializer(serializers.ModelSerializer):
    fileName = serializers.SerializerMethodField(read_only=True)
    fileSize = serializers.SerializerMethodField(read_only=True)
    uploadedAt = serializers.DateTimeField(source='uploaded_at', read_only=True)
    downloadUrl = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Resume
        fields = ['id', 'fileName', 'fileSize', 'status', 'uploadedAt', 'downloadUrl', 'parsed_skills_json', 'extracted_experience_json']

    def get_fileName(self, obj):
        return os.path.basename(obj.file.name) if obj.file else 'Resume.pdf'

    def get_fileSize(self, obj):
        try:
            bytes_size = obj.file.size
            if bytes_size < 1024 * 1024:
                return f"{bytes_size / 1024:.1f} KB"
            return f"{bytes_size / (1024 * 1024):.1f} MB"
        except Exception:
            return "1.8 MB"

    def get_downloadUrl(self, obj):
        if obj.file:
            return obj.file.url
        return "#"
