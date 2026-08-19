from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Assessment, Question, AssessmentResult
from .serializers import QuestionEmployeeSerializer, AssessmentSerializer, AssessmentResultSerializer
from skills.models import Skill, UserSkill

BENCHMARK_FALLBACK_QUESTIONS = [
    {
        "id": 1,
        "question": "What is the primary benefit of TypeScript's 'unknown' type over 'any'?",
        "options": [
            "It forces type checking before performing any operations or method calls.",
            "It automatically converts string variables to numbers at runtime.",
            "It completely disables type checking for performance gains.",
            "It can only store primitive numerical values."
        ]
    },
    {
        "id": 2,
        "question": "In modern React, what is the primary purpose of the 'use' hook?",
        "options": [
            "To read asynchronous resources like Promises or Context dynamically inside render.",
            "To completely replace useEffect for browser DOM updates.",
            "To initialize Redux toolkit slices inside class components.",
            "To style components dynamically using CSS-in-JS primitives."
        ]
    },
    {
        "id": 3,
        "question": "Which React hook should be used to cache expensive calculations between re-renders?",
        "options": [
            "useMemo",
            "useCallback",
            "useRef",
            "useImperativeHandle"
        ]
    },
    {
        "id": 4,
        "question": "How does React's Virtual DOM diffing algorithm optimize DOM updates?",
        "options": [
            "By comparing fiber trees and batching minimal DOM mutations.",
            "By saving HTML snapshots directly into browser localStorage.",
            "By running WebAssembly scripts on the server.",
            "By bypassing layout calculations completely."
        ]
    },
    {
        "id": 5,
        "question": "What happens when a component throws a Promise inside a <Suspense> boundary?",
        "options": [
            "React suspends rendering and displays the fallback UI until the Promise resolves.",
            "The browser throws an unhandled error and halts JavaScript execution.",
            "The page reloads immediately.",
            "All state variables are reset to null."
        ]
    }
]

class QuestionsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        skill_id = request.query_params.get('skill')
        questions = Question.objects.all()

        if skill_id:
            questions = questions.filter(assessment__skill_id=skill_id)

        if questions.exists():
            serializer = QuestionEmployeeSerializer(questions, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(BENCHMARK_FALLBACK_QUESTIONS, status=status.HTTP_200_OK)

class SubmitAssessmentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        data = request.data
        user_answers = data.get('answers', {})  # Dict mapping question_id -> chosen option index
        
        total_questions = len(user_answers) if user_answers else 5
        correct_count = 0

        # Evaluate submitted answers against DB or benchmark rules
        for q_id_str, chosen_idx in user_answers.items():
            try:
                q = Question.objects.get(id=q_id_str)
                if int(chosen_idx) == q.correct_answer:
                    correct_count += 1
            except (Question.DoesNotExist, ValueError):
                if int(chosen_idx) == 0:  # Benchmark fallback default answer
                    correct_count += 1

        if total_questions == 0:
            total_questions = 5
            correct_count = 4

        score = int((correct_count / total_questions) * 100)
        accuracy = score
        wrong_count = total_questions - correct_count

        strengths = ["React Architecture", "TypeScript Typing", "State Management"]
        weaknesses = ["Client-side AI Integration", "WebAssembly Modules"]

        # Find or create AssessmentResult
        assessment = Assessment.objects.first()
        if not assessment:
            assessment = Assessment.objects.create(title="Technical Benchmark Skill Assessment")

        res = AssessmentResult.objects.create(
            user=request.user,
            assessment=assessment,
            score=score,
            accuracy=accuracy,
            correct_answers=correct_count,
            wrong_answers=wrong_count,
            strengths=strengths,
            weaknesses=weaknesses
        )

        # Update User Skill Proficiency
        user_skills = UserSkill.objects.filter(user=request.user)
        for us in user_skills:
            # Update skill percentage smoothly
            us.proficiency_percentage = (us.proficiency_percentage + score) // 2
            
            # Determine new level based on updated percentage
            if us.proficiency_percentage >= 80:
                us.level = 'Advanced'
            elif us.proficiency_percentage >= 50:
                us.level = 'Intermediate'
            else:
                us.level = 'Beginner'
            
            us.save()

        return Response({
            "success": True,
            "message": "Assessment submitted successfully",
            "data": {
                "score": score,
                "accuracy": accuracy,
                "correct_answers": correct_count,
                "wrong_answers": wrong_count,
                "strengths": strengths,
                "weaknesses": weaknesses,
                "updatedSkillLevel": "Advanced" if score >= 80 else "Intermediate"
            }
        }, status=status.HTTP_200_OK)
