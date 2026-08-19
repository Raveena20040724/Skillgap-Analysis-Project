from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from accounts.models import CustomUser

class AuthenticationTests(APITestCase):
    def setUp(self):
        self.register_url = reverse('auth_register')
        self.login_url = reverse('auth_login')
        self.me_url = reverse('auth_me')

        self.user_data = {
            'username': 'testemployee',
            'email': 'test@example.com',
            'password': 'password123',
            'department': 'Engineering',
            'phone': '1234567890'
        }

    def test_register_user(self):
        response = self.client.post(self.register_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertIn('access', response.data['data'])

    def test_login_user(self):
        CustomUser.objects.create_user(**self.user_data)
        login_data = {
            'username': 'testemployee',
            'password': 'password123'
        }
        response = self.client.post(self.login_url, login_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertIn('access', response.data['data'])

    def test_get_current_user_authenticated(self):
        user = CustomUser.objects.create_user(**self.user_data)
        self.client.force_authenticate(user=user)
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'test@example.com')

class RBACTests(APITestCase):
    def setUp(self):
        self.employee = CustomUser.objects.create_user(username='emp', email='emp@test.com', password='pass', role='employee')
        self.hr = CustomUser.objects.create_user(username='hr', email='hr@test.com', password='pass', role='hr')
        self.admin = CustomUser.objects.create_user(username='admin', email='admin@test.com', password='pass', role='admin')
        self.hr_overview_url = reverse('hr_overview')

    def test_employee_cannot_access_hr_overview(self):
        self.client.force_authenticate(user=self.employee)
        response = self.client.get(self.hr_overview_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_hr_can_access_hr_overview(self):
        self.client.force_authenticate(user=self.hr)
        response = self.client.get(self.hr_overview_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
