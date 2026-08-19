from rest_framework import serializers
from .models import Assessment, Question, AssessmentResult

class QuestionEmployeeSerializer(serializers.ModelSerializer):
    question = serializers.CharField(source='question_text', read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'question', 'question_text', 'options']
        # EXCLUDED: correct_answer & explanation to protect exam integrity!

class QuestionAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'question_text', 'options', 'correct_answer', 'explanation']

class AssessmentSerializer(serializers.ModelSerializer):
    questions = QuestionEmployeeSerializer(many=True, read_only=True)

    class Meta:
        model = Assessment
        fields = ['id', 'title', 'description', 'category', 'difficulty', 'duration_minutes', 'questions']

class AssessmentResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentResult
        fields = ['id', 'assessment', 'score', 'accuracy', 'correct_answers', 'wrong_answers', 'strengths', 'weaknesses', 'attempted_at']
        read_only_fields = ['id', 'attempted_at']
