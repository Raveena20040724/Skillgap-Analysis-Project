from rest_framework import serializers
from accounts.models import CustomUser
from profiles.models import EmployeeProfile

class EmployeeDirectorySerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    skillReadinessScore = serializers.SerializerMethodField(read_only=True)
    experienceYears = serializers.SerializerMethodField(read_only=True)
    bio = serializers.SerializerMethodField(read_only=True)
    location = serializers.SerializerMethodField(read_only=True)
    status = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'name', 'designation', 'department', 'email', 'phone', 'avatar', 'skillReadinessScore', 'experienceYears', 'status', 'location', 'bio']

    def get_name(self, obj):
        return obj.get_full_name() or obj.username

    def get_skillReadinessScore(self, obj):
        profile = getattr(obj, 'employee_profile', None)
        return profile.readiness_score if profile else 84

    def get_experienceYears(self, obj):
        profile = getattr(obj, 'employee_profile', None)
        return profile.experience_years if profile else 4

    def get_bio(self, obj):
        profile = getattr(obj, 'employee_profile', None)
        return profile.bio if profile else 'Software Engineer'

    def get_location(self, obj):
        profile = getattr(obj, 'employee_profile', None)
        return profile.location if profile else 'San Francisco, CA'

    def get_status(self, obj):
        return 'Active' if obj.is_active else 'Inactive'
