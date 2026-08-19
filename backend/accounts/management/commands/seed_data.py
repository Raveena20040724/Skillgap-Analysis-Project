from django.core.management.base import BaseCommand
from accounts.models import CustomUser
from profiles.models import EmployeeProfile, WorkExperience
from skills.models import Skill, UserSkill
from courses.models import Course
from assessments.models import Assessment, Question

class Command(BaseCommand):
    help = 'Seeds initial database with default skills, courses, assessments, and sample users.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("Starting database seeding..."))

        # 1. Admin User
        admin_user, created = CustomUser.objects.get_or_create(
            username='admin',
            email='admin@company.com',
            defaults={
                'role': 'admin',
                'department': 'Operations',
                'designation': 'System Administrator',
                'is_staff': True,
                'is_superuser': True
            }
        )
        if created:
            admin_user.set_password('password123')
            admin_user.save()
            self.stdout.write(self.style.SUCCESS("Created Admin user: admin@company.com / password123"))

        # 2. HR User
        hr_user, created = CustomUser.objects.get_or_create(
            username='sarah_hr',
            email='sarah.jenkins@company.com',
            defaults={
                'role': 'hr',
                'department': 'Engineering',
                'designation': 'Senior HR & Talent Lead',
                'phone': '+1 (555) 987-6543'
            }
        )
        if created:
            hr_user.set_password('password123')
            hr_user.save()
            self.stdout.write(self.style.SUCCESS("Created HR user: sarah.jenkins@company.com / password123"))

        # 3. Employee User
        emp_user, created = CustomUser.objects.get_or_create(
            username='alex_morgan',
            email='alex.morgan@company.com',
            defaults={
                'first_name': 'Alex',
                'last_name': 'Morgan',
                'role': 'employee',
                'department': 'Engineering',
                'designation': 'Senior Frontend Developer',
                'phone': '+1 (555) 234-5678'
            }
        )
        if created:
            emp_user.set_password('password123')
            emp_user.save()
            self.stdout.write(self.style.SUCCESS("Created Employee user: alex.morgan@company.com / password123"))

        # Employee Profile
        profile, _ = EmployeeProfile.objects.get_or_create(
            user=emp_user,
            defaults={
                'location': 'San Francisco, CA',
                'experience_years': 5,
                'bio': 'Passionate Web Architect focusing on React, TypeScript, scalable UI design systems, and AI optimization.',
                'readiness_score': 84
            }
        )

        # Work Experience
        WorkExperience.objects.get_or_create(
            user=emp_user,
            role='Senior Frontend Developer',
            company='TechCorp Global',
            defaults={'duration': '2023 - Present', 'description': 'Leading frontend team building SaaS applications.'}
        )

        # 4. Default Skills Taxonomy
        skills_data = [
            ('React.js & Frontend', 'Programming'),
            ('Python & Django', 'Programming'),
            ('PostgreSQL & SQL', 'Database'),
            ('AWS Cloud Infrastructure', 'Cloud'),
            ('Docker & CI/CD Pipelines', 'DevOps'),
            ('UI/UX Design Systems', 'UI/UX'),
            ('Machine Learning Fundamentals', 'AI'),
            ('Technical Team Leadership', 'Leadership'),
        ]

        for s_name, s_cat in skills_data:
            skill, _ = Skill.objects.get_or_create(name=s_name, defaults={'category': s_cat})
            UserSkill.objects.get_or_create(
                user=emp_user,
                skill=skill,
                defaults={'level': 'Advanced', 'years_experience': 3, 'proficiency_percentage': 85, 'verified': True}
            )

        # 5. Default Courses
        courses_data = [
            ("Modern TypeScript Design Patterns", "Meta / Coursera", "Programming", "Advanced", 18),
            ("Enterprise Micro-Frontends & Module Federation", "Frontend Masters", "Web Architecture", "Advanced", 24),
            ("Full-Stack System Design & Web Performance", "Udacity Nanodegree", "System Design", "Expert", 32)
        ]
        for c_title, c_prov, c_cat, c_diff, c_dur in courses_data:
            Course.objects.get_or_create(
                title=c_title,
                defaults={'provider': c_prov, 'category': c_cat, 'difficulty': c_diff, 'duration_hours': c_dur}
            )

        # 6. Default Assessment & Questions
        assessment, _ = Assessment.objects.get_or_create(
            title="Technical Benchmark Skill Assessment",
            defaults={'category': 'Programming', 'difficulty': 'Intermediate', 'duration_minutes': 15}
        )

        questions_data = [
            (
                "What is the primary benefit of TypeScript's 'unknown' type over 'any'?",
                ["It forces type checking before performing any operations or method calls.", "It automatically converts string variables to numbers.", "It completely disables type checking.", "It can only store numbers."],
                0,
                "'unknown' is type-safe. You cannot perform operations on unknown without narrowing."
            ),
            (
                "In modern React, what is the primary purpose of the 'use' hook?",
                ["To read asynchronous resources like Promises or Context dynamically inside render.", "To completely replace useEffect.", "To initialize Redux toolkit slices.", "To style components."],
                0,
                "'use' allows reading resources like promises in render."
            ),
            (
                "Which React hook should be used to cache expensive calculations between re-renders?",
                ["useMemo", "useCallback", "useRef", "useImperativeHandle"],
                0,
                "useMemo caches calculation results."
            )
        ]

        for q_text, q_opts, q_ans, q_exp in questions_data:
            Question.objects.get_or_create(
                assessment=assessment,
                question_text=q_text,
                defaults={'options': q_opts, 'correct_answer': q_ans, 'explanation': q_exp}
            )

        self.stdout.write(self.style.SUCCESS("Database seeding completed successfully!"))
