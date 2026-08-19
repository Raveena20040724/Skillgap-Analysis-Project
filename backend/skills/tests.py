from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from accounts.models import CustomUser
from skills.models import Skill, UserSkill

class SkillsAPITests(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(username='skilluser', email='skilluser@test.com', password='password123')
        self.client.force_authenticate(user=self.user)
        self.skills_url = reverse('employee_skills_list')

    def test_add_and_list_skill(self):
        payload = {
            'name': 'Django REST Framework',
            'category': 'Programming',
            'level': 'Advanced',
            'yearsOfExperience': 3,
            'proficiencyPercentage': 88
        }
        response = self.client.post(self.skills_url, payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        list_resp = self.client.get(self.skills_url)
        self.assertEqual(list_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(list_resp.data), 1)

    def test_duplicate_skill_prevention(self):
        payload = {'name': 'Python', 'level': 'Intermediate'}
        self.client.post(self.skills_url, payload)
        # Adding same skill again should update rather than duplicate
        response = self.client.post(self.skills_url, payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(UserSkill.objects.filter(user=self.user).count(), 1)
