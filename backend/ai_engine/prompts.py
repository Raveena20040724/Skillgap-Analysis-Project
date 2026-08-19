RESUME_PARSER_PROMPT = """
Analyze the following resume text and extract key candidate information.
Return a STRICT JSON object with this structure:
{
    "name": "Full Name",
    "email": "Email",
    "phone": "Phone Number",
    "location": "City, Country",
    "skills": [
        {"name": "Skill Name", "category": "Category", "proficiency": "Beginner/Intermediate/Advanced/Expert"}
    ],
    "experience": [
        {"company": "Company Name", "designation": "Job Title", "years": 2, "description": "Summary"}
    ],
    "education": ["Degree details"],
    "certifications": ["Certification names"],
    "projects": ["Project descriptions"]
}

Resume Text:
{resume_text}
"""

CAREER_RECOMMENDATION_PROMPT = """
Based on the following employee profile and skills, recommend 3 suitable target career roles.
Employee Current Role: {designation} ({department})
Employee Skills: {skills_summary}
Years Experience: {years_exp}

Return a STRICT JSON object with key "recommendations":
[
    {
        "id": 1,
        "role": "Role Title",
        "matchScore": 92,
        "aiConfidence": "94% AI Confidence",
        "salary": "$150,000 - $180,000 / yr",
        "upskillTime": "3 Months",
        "demandGrowth": "+25% YoY Growth",
        "requiredSkills": [
            {"name": "Skill 1", "possessed": true},
            {"name": "Skill 2", "possessed": false}
        ],
        "overview": "Clear summary of responsibilities and career growth path."
    }
]
"""

LEARNING_PATH_PROMPT = """
Generate a 4-stage learning path roadmap for target role '{target_role}' based on missing/weak skills: {missing_skills}.

Return a STRICT JSON object with key "roadmap":
[
    {
        "id": 1,
        "stageLevel": "BEGINNER STAGE",
        "stageLevelBg": "bg-blue-500/10 text-blue-600 border-blue-500/30",
        "duration": "4 Weeks",
        "title": "Foundation & Core Principles",
        "status": "completed",
        "statusLabel": "✓ Stage Completed",
        "courses": ["Course Title 1", "Course Title 2"],
        "projects": ["Hands-on Project Title"],
        "credentials": "Certification Name"
    }
]
"""
