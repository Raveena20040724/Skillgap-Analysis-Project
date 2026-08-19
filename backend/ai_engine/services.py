from skills.models import UserSkill
from .grok_client import GrokClient
from .prompts import CAREER_RECOMMENDATION_PROMPT, LEARNING_PATH_PROMPT

ROLE_REQUIREMENTS = {
    'Senior Frontend Developer': [
        {'skill': 'React.js', 'requiredLevel': 90},
        {'skill': 'Python', 'requiredLevel': 80},
        {'skill': 'SQL', 'requiredLevel': 75},
        {'skill': 'Machine Learning', 'requiredLevel': 70},
        {'skill': 'Communication', 'requiredLevel': 85},
    ],
    'Full Stack Engineer': [
        {'skill': 'React.js', 'requiredLevel': 85},
        {'skill': 'Python', 'requiredLevel': 85},
        {'skill': 'SQL', 'requiredLevel': 80},
        {'skill': 'Docker', 'requiredLevel': 75},
        {'skill': 'AWS Cloud', 'requiredLevel': 70},
    ]
}

def calculate_skill_gap(user):
    user_skills = {us.skill.name.lower(): us.proficiency_percentage for us in UserSkill.objects.filter(user=user)}
    target_role = user.designation or 'Senior Frontend Developer'
    reqs = ROLE_REQUIREMENTS.get(target_role, ROLE_REQUIREMENTS['Senior Frontend Developer'])

    results = []
    total_required = 0
    total_current = 0

    for item in reqs:
        s_name = item['skill']
        req_lvl = item['requiredLevel']
        curr_lvl = user_skills.get(s_name.lower(), 40)
        gap = max(0, req_lvl - curr_lvl)

        results.append({
            'skill': s_name,
            'currentLevel': curr_lvl,
            'requiredLevel': req_lvl,
            'gap': gap
        })

        total_required += req_lvl
        total_current += min(curr_lvl, req_lvl)

    readiness_score = int((total_current / total_required) * 100) if total_required > 0 else 75

    return {
        'target_role': target_role,
        'readiness_score': readiness_score,
        'gap_matrix': results
    }

def get_career_recommendations(user):
    user_skills = UserSkill.objects.filter(user=user)
    skills_summary = ", ".join([f"{us.skill.name} ({us.level})" for us in user_skills]) or "React, Python, SQL"
    
    client = GrokClient()
    prompt = CAREER_RECOMMENDATION_PROMPT.replace(
        "{designation}", str(user.designation or "Developer")
    ).replace(
        "{department}", str(user.department or "Engineering")
    ).replace(
        "{skills_summary}", skills_summary
    ).replace(
        "{years_exp}", "3"
    )

    grok_result = client.call_grok(prompt)
    if grok_result and 'recommendations' in grok_result:
        return grok_result['recommendations']

    # Deterministic fallback recommendations
    return [
        {
            "id": 1,
            "role": "Principal Frontend Architect",
            "matchScore": 94,
            "aiConfidence": "96% AI Confidence",
            "salary": "$165,000 - $210,000 / yr",
            "upskillTime": "3 Months",
            "demandGrowth": "+28% YoY Industry Demand Growth",
            "requiredSkills": [
                {"name": "React", "possessed": True},
                {"name": "TypeScript", "possessed": True},
                {"name": "Design Systems", "possessed": True},
                {"name": "Micro-frontends", "possessed": False}
            ],
            "overview": "Lead architecture of enterprise-scale frontend applications, design reusable component libraries, and optimize web vitals performance."
        },
        {
            "id": 2,
            "role": "Full-Stack Engineering Lead",
            "matchScore": 86,
            "aiConfidence": "88% AI Confidence",
            "salary": "$150,000 - $185,000 / yr",
            "upskillTime": "5 Months",
            "demandGrowth": "+22% YoY Demand",
            "requiredSkills": [
                {"name": "React", "possessed": True},
                {"name": "Node.js / Python", "possessed": True},
                {"name": "AWS Cloud", "possessed": False},
                {"name": "Docker", "possessed": True}
            ],
            "overview": "Oversee end-to-end software development, manage REST API services, and orchestrate cloud deployments."
        },
        {
            "id": 3,
            "role": "AI Product Front-End Architect",
            "matchScore": 82,
            "aiConfidence": "85% AI Confidence",
            "salary": "$170,000 - $220,000 / yr",
            "upskillTime": "4 Months",
            "demandGrowth": "+45% YoY High-Growth Sector",
            "requiredSkills": [
                {"name": "React", "possessed": True},
                {"name": "TypeScript", "possessed": True},
                {"name": "LangChain", "possessed": False},
                {"name": "Python APIs", "possessed": True}
            ],
            "overview": "Pioneer the creation of intuitive user interfaces for generative AI applications and LLM-powered enterprise tooling."
        }
    ]

def get_learning_path(user):
    gap_data = calculate_skill_gap(user)
    missing_skills_list = [item['skill'] for item in gap_data['gap_matrix'] if item['gap'] > 0]
    missing_skills = ", ".join(missing_skills_list) or "Docker, AWS Cloud, System Architecture"

    client = GrokClient()
    prompt = LEARNING_PATH_PROMPT.replace(
        "{target_role}", str(user.designation or "Senior Frontend Developer")
    ).replace(
        "{missing_skills}", missing_skills
    )

    grok_result = client.call_grok(prompt)
    if grok_result and 'roadmap' in grok_result:
        return grok_result['roadmap']

    # Deterministic fallback learning roadmap matching frontend expectations
    return [
        {
            "id": 1,
            "stageLevel": "BEGINNER STAGE",
            "stageLevelBg": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
            "duration": "4 Weeks",
            "title": "Foundation & Modern Core",
            "status": "completed",
            "statusLabel": "✓ Stage Completed",
            "statusBg": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
            "courses": ["Modern TypeScript Design Patterns", "Advanced React 18 Patterns"],
            "projects": ["Responsive Component Library with Tailwind"],
            "credentials": "Meta Frontend Professional"
        },
        {
            "id": 2,
            "stageLevel": "INTERMEDIATE STAGE",
            "stageLevelBg": "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
            "duration": "6 Weeks",
            "title": "State Architecture & Performance",
            "status": "completed",
            "statusLabel": "✓ Stage Completed",
            "statusBg": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
            "courses": ["Redux Toolkit & Zustand Mastery", "Web Vitals & Performance Optimization"],
            "projects": ["High-Throughput Financial Dashboard"],
            "credentials": "Senior React Developer Certificate"
        },
        {
            "id": 3,
            "stageLevel": "ADVANCED STAGE",
            "stageLevelBg": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
            "duration": "8 Weeks",
            "title": "Micro-Frontends & Design Systems",
            "status": "in-progress",
            "statusLabel": "In Progress",
            "statusBg": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
            "courses": ["Module Federation & Micro-frontends", "Enterprise Design System Engineering"],
            "projects": ["Enterprise Multi-App Design System v3"],
            "credentials": "Frontend System Architect Certification"
        },
        {
            "id": 4,
            "stageLevel": "EXPERT STAGE",
            "stageLevelBg": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
            "duration": "6 Weeks",
            "title": "AI Integration & WebAssembly",
            "status": "upcoming",
            "statusLabel": "Upcoming",
            "statusBg": "bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/30",
            "courses": ["Client-Side AI & Vector Embeddings", "WebAssembly & C++ Modules in Web Apps"],
            "projects": ["In-Browser AI Code Assistant Extension"],
            "credentials": "AI Web Application Specialist"
        }
    ]
