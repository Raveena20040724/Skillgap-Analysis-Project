from rest_framework import serializers
from .models import Course, UserCourse

class CourseSerializer(serializers.ModelSerializer):
    enrolled = serializers.SerializerMethodField(read_only=True)
    progressPercentage = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'provider', 'provider_url', 'category', 'difficulty', 'duration_hours', 'thumbnail', 'enrolled', 'progressPercentage']

    def get_enrolled(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if user and user.is_authenticated:
            return UserCourse.objects.filter(user=user, course=obj).exists()
        return False

    def get_progressPercentage(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if user and user.is_authenticated:
            uc = UserCourse.objects.filter(user=user, course=obj).first()
            return uc.progress_percentage if uc else 0
        return 0

class UserCourseSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)

    class Meta:
        model = UserCourse
        fields = ['id', 'course', 'progress_percentage', 'started_at', 'completed_at']
