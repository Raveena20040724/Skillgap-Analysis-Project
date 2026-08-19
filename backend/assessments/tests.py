from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from accounts.models import CustomUser
from assessments.models import Assessment, Question

class AssessmentSecurityTests(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(username='examuser', email='examuser@test.com', password='password123')
        self.client.force_authenticate(user=self.user)
        self.assessment = Assessment.objects.create(title="Security Test Exam")
        self.question = Question.objects.create(
            assessment=self.assessment,
            question_text="What is 2+2?",
            options=["3", "4", "5"],
            correct_answer=1,
            explanation="2+2 equals 4"
        )
        self.questions_url = reverse('assessment_questions')

    def test_correct_answer_hidden_from_employee(self):
        response = self.client.get(self.questions_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Verify correct_answer is NOT in response payload
        first_q = response.data[0]
        self.assertNotIn('correct_answer', first_q)
        self.assertNotIn('explanation', first_q)
