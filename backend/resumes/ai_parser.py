import os
import re
import logging

logger = logging.getLogger(__name__)

# Refined Skill Taxonomy — Removed overly sensitive short codes like 's3', 'ec2', 'ml'
SKILL_TAXONOMY = [
    {'name': 'Python', 'category': 'Programming', 'keywords': ['python', 'django', 'flask', 'fastapi']},
    {'name': 'React.js', 'category': 'Programming', 'keywords': ['react', 'react.js', 'reactjs', 'redux', 'nextjs', 'next.js']},
    {'name': 'JavaScript', 'category': 'Programming', 'keywords': ['javascript', 'es6', 'node', 'nodejs']},
    {'name': 'TypeScript', 'category': 'Programming', 'keywords': ['typescript']},
    {'name': 'HTML5 & CSS3', 'category': 'UI/UX', 'keywords': ['html', 'html5', 'css', 'css3', 'sass', 'tailwind']},
    {'name': 'Java', 'category': 'Programming', 'keywords': ['java', 'spring', 'springboot']},
    {'name': 'C++', 'category': 'Programming', 'keywords': ['c++', 'cpp']},
    {'name': 'SQL & Databases', 'category': 'Database', 'keywords': ['sql', 'mysql', 'postgres', 'postgresql', 'sqlite']},
    {'name': 'MongoDB', 'category': 'Database', 'keywords': ['mongo', 'mongodb', 'nosql']},
    {'name': 'Figma & UI/UX', 'category': 'UI/UX', 'keywords': ['figma', 'ui/ux', 'wireframe']},
    {'name': 'REST APIs', 'category': 'Programming', 'keywords': ['rest api', 'restful', 'endpoints', 'axios']},
    {'name': 'Git & GitHub', 'category': 'Programming', 'keywords': ['git', 'github', 'gitlab']},
    {'name': 'Machine Learning', 'category': 'AI', 'keywords': ['machine learning', 'pytorch', 'tensorflow', 'scikit-learn']},
    {'name': 'Docker', 'category': 'DevOps', 'keywords': ['docker', 'containerization']},
    {'name': 'CI/CD Pipelines', 'category': 'DevOps', 'keywords': ['ci/cd', 'jenkins', 'gitlab ci']},
    {'name': 'AWS Cloud', 'category': 'Cloud', 'keywords': ['aws', 'amazon web services', 'aws cloud']},
]


def extract_text_from_file(file_path):
    ext = os.path.splitext(file_path)[1].lower()
    text = ""
    try:
        if ext == '.pdf':
            try:
                import pdfplumber
                with pdfplumber.open(file_path) as pdf:
                    for page in pdf.pages:
                        page_text = page.extract_text()
                        if page_text:
                            text += page_text + "\n"
            except Exception:
                with open(file_path, 'rb') as f:
                    content = f.read().decode('utf-8', errors='ignore')
                    text = " ".join(re.findall(r'[a-zA-Z0-9+#.]{2,}', content))
        elif ext in ['.doc', '.docx']:
            try:
                import docx
                doc = docx.Document(file_path)
                for paragraph in doc.paragraphs:
                    text += paragraph.text + "\n"
            except Exception:
                with open(file_path, 'rb') as f:
                    content = f.read().decode('utf-8', errors='ignore')
                    text = " ".join(re.findall(r'[a-zA-Z0-9+#.]{2,}', content))
        else:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                text = f.read()
    except Exception as e:
        logger.error(f"Error extracting text from file {file_path}: {e}")

    return text.strip()


def extract_skills_from_text(text):
    if not text:
        return []
    extracted = []
    seen = set()

    for item in SKILL_TAXONOMY:
        for kw in item['keywords']:
            if len(kw) <= 4:
                pattern = r'(?:\b|[^a-zA-Z0-9+#])' + re.escape(kw) + r'(?:\b|[^a-zA-Z0-9+#])'
                if re.search(pattern, text, re.IGNORECASE):
                    if item['name'] not in seen:
                        seen.add(item['name'])
                        extracted.append({'name': item['name'], 'category': item['category'], 'proficiency': 'Intermediate'})
                    break
            else:
                if kw.lower() in text.lower():
                    if item['name'] not in seen:
                        seen.add(item['name'])
                        extracted.append({'name': item['name'], 'category': item['category'], 'proficiency': 'Intermediate'})
                    break
    return extracted


def parse_resume_with_grok(file_path):
    text = extract_text_from_file(file_path)
    dynamic_skills = extract_skills_from_text(text)
    return {
        'skills': dynamic_skills,
        'experience': [],
        'education': [],
        'certifications': [],
        'projects': []
    }
