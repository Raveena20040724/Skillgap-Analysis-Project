from django.core.management.base import BaseCommand
from courses.models import Course

class Command(BaseCommand):
    help = 'Seeds the database with sample courses'

    def handle(self, *args, **kwargs):
        courses = [
            {
                'title': 'Advanced React 18 Patterns',
                'description': 'Master modern React patterns including concurrent mode, server components, and advanced hooks.',
                'provider': 'Frontend Masters',
                'provider_url': 'https://frontendmasters.com',
                'category': 'Programming',
                'difficulty': 'Advanced',
                'duration_hours': 15,
                'thumbnail': 'https://placehold.co/600x400/4f46e5/ffffff?text=React+18'
            },
            {
                'title': 'Python Django Enterprise Architecture',
                'description': 'Build scalable backend systems with Django, Celery, Redis, and PostgreSQL.',
                'provider': 'Udemy',
                'provider_url': 'https://udemy.com',
                'category': 'Backend',
                'difficulty': 'Intermediate',
                'duration_hours': 25,
                'thumbnail': 'https://placehold.co/600x400/10b981/ffffff?text=Django+Enterprise'
            },
            {
                'title': 'Docker & Kubernetes for Developers',
                'description': 'Containerize your applications and orchestrate them with Kubernetes.',
                'provider': 'Coursera',
                'provider_url': 'https://coursera.org',
                'category': 'DevOps',
                'difficulty': 'Intermediate',
                'duration_hours': 20,
                'thumbnail': 'https://placehold.co/600x400/0ea5e9/ffffff?text=Docker+K8s'
            },
            {
                'title': 'System Architecture Design',
                'description': 'Learn to design large-scale distributed systems.',
                'provider': 'Educative',
                'provider_url': 'https://educative.io',
                'category': 'Architecture',
                'difficulty': 'Advanced',
                'duration_hours': 30,
                'thumbnail': 'https://placehold.co/600x400/8b5cf6/ffffff?text=System+Design'
            },
            {
                'title': 'AWS Cloud Practitioner',
                'description': 'Get started with AWS cloud services.',
                'provider': 'AWS Training',
                'provider_url': 'https://aws.amazon.com/training/',
                'category': 'Cloud',
                'difficulty': 'Beginner',
                'duration_hours': 10,
                'thumbnail': 'https://placehold.co/600x400/f59e0b/ffffff?text=AWS+Cloud'
            }
        ]

        for course_data in courses:
            Course.objects.get_or_create(title=course_data['title'], defaults=course_data)

        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {len(courses)} courses.'))
