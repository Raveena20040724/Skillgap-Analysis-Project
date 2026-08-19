from rest_framework import serializers
from .models import Skill, UserSkill

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'category', 'description', 'created_at']

class UserSkillSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='skill.name', read_only=True)
    category = serializers.CharField(source='skill.category', read_only=True)
    yearsOfExperience = serializers.IntegerField(source='years_experience', required=False)
    proficiencyPercentage = serializers.IntegerField(source='proficiency_percentage', required=False)

    class Meta:
        model = UserSkill
        fields = [
            'id', 'skill', 'name', 'category', 'level',
            'years_experience', 'yearsOfExperience',
            'proficiency_percentage', 'proficiencyPercentage',
            'verified', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
