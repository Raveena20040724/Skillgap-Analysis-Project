from rest_framework import serializers
from .models import EmployeeProfile, WorkExperience
from accounts.serializers import UserSerializer
from skills.serializers import UserSkillSerializer

class WorkExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkExperience
        fields = ['id', 'role', 'company', 'duration', 'start_date', 'end_date', 'description', 'is_current', 'created_at']
        read_only_fields = ['id', 'created_at']

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    name = serializers.SerializerMethodField(read_only=True)
    designation = serializers.SerializerMethodField(read_only=True)
    department = serializers.SerializerMethodField(read_only=True)
    email = serializers.SerializerMethodField(read_only=True)
    avatar = serializers.SerializerMethodField(read_only=True)
    workExperience = serializers.SerializerMethodField(read_only=True)
    technicalSkills = serializers.SerializerMethodField(read_only=True)
    certifications = serializers.JSONField(source='certifications_json', required=False)
    projects = serializers.JSONField(source='projects_json', required=False)

    class Meta:
        model = EmployeeProfile
        fields = [
            'id', 'user', 'name', 'designation', 'department', 'email', 'avatar',
            'phone', 'location', 'experience_years', 'education', 'bio',
            'linkedin', 'github', 'portfolio', 'readiness_score',
            'profile_completion_score', 'resume_completion_score',
            'workExperience', 'technicalSkills', 'certifications', 'projects',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_name(self, obj):
        return obj.user.get_full_name() or obj.user.username

    def get_designation(self, obj):
        return obj.user.designation or 'Senior Frontend Developer'

    def get_department(self, obj):
        return obj.user.department or 'Engineering'

    def get_email(self, obj):
        return obj.user.email

    def get_avatar(self, obj):
        return obj.user.avatar or 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'

    def get_workExperience(self, obj):
        exps = WorkExperience.objects.filter(user=obj.user)
        return WorkExperienceSerializer(exps, many=True).data

    def get_technicalSkills(self, obj):
        from skills.models import UserSkill
        user_skills = UserSkill.objects.filter(user=obj.user)
        return UserSkillSerializer(user_skills, many=True).data
