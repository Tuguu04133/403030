import re
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy import func, desc, or_
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.teacher import Teacher
from app.models.student import Student
from app.models.committee import Committee, CommitteeMember
from app.models.evaluation import OverallEvaluation, JinkheneKomissinGishvvd

router = APIRouter()


def standardize_semester(sem_str: str | None) -> str | None:
    if not sem_str:
        return None
    sem_lower = sem_str.lower()
    if "хавар" in sem_lower or "spring" in sem_lower:
        return "SPRING"
    if "намар" in sem_lower or "fall" in sem_lower or "autumn" in sem_lower:
        return "FALL"
    return sem_str.upper()


@router.get("/advisers")
def recommend_advisers(
    subject: str = Query(..., min_length=1, description="The free-text thesis subject typed by the student"),
    limit: int = Query(default=3, ge=1, le=10),
    year: int | None = None,
    semester: str | None = None,
    db: Session = Depends(get_db),
):
    """Adviser Recommendation & Thesis Subject Advisor System."""
    sem = standardize_semester(semester)

    # 1. Subject Classification
    subject_lower = subject.lower()
    
    category_keywords = {
        "AI": ["хиймэл оюун", "ai", "cnn", "deep learning", "царай таних", "nlp", "загвар", "сургалт"],
        "AppDev": ["вэб", "web", "апп", "app", "erp", "систем", "хөгжүүлэлт", "сайт", "платформ"],
        "Game": ["тоглоом", "game", "vr", "rpg", "shooter", "unity"],
        "Sys": ["сервер", "server", "сүлжээ", "docker", "cloud", "аюулгүй байдал", "network", "linux"]
    }
    
    detected_field = None
    for cat, keywords in category_keywords.items():
        if any(kw in subject_lower for kw in keywords):
            detected_field = cat
            break

    # If no match, default to the most registered topic category of the current semester
    if not detected_field:
        # Query most popular category
        cat_query = db.query(Student.category, func.count(Student.id).label("cnt"))
        if year is not None:
            cat_query = cat_query.filter(Student.year == year)
        if sem is not None:
            cat_query = cat_query.filter(Student.semester == sem)
        
        most_popular = cat_query.group_by(Student.category).order_by(desc("cnt")).first()
        detected_field = most_popular[0] if most_popular else "AI"

    field_labels = {
        "AI": "Хиймэл Оюун Ухаан (AI)",
        "AppDev": "Аппликейшн Хөгжүүлэлт (AppDev)",
        "Game": "Тоглоом Хөгжүүлэлт (Game)",
        "Sys": "Систем ба Сүлжээ (Sys)"
    }
    field_label = field_labels.get(detected_field, f"{detected_field} Чиглэл")

    # 2. Teacher Suitability Rating
    # We look for teachers whose expertise matches the detected field, or all teachers as fallback
    teachers = db.query(Teacher).filter(Teacher.expertise == detected_field).all()
    if not teachers:
        teachers = db.query(Teacher).all()

    recommended_teachers = []
    for t in teachers:
        # A. Count students supervised
        s_count_query = db.query(func.count(Student.id)).filter(Student.supervisor_id == t.id)
        if year is not None:
            s_count_query = s_count_query.filter(Student.year == year)
        if sem is not None:
            s_count_query = s_count_query.filter(Student.semester == sem)
        student_count = s_count_query.scalar() or 0

        # B. Calculate average grade received by students supervised by this teacher AND topic similarity bonus
        total_grades = []
        similarity_bonus_scores = []
        supervised_students = db.query(Student).filter(Student.supervisor_id == t.id).all()
        
        # Tokenize the search subject for similarity checking
        subject_cleaned = subject.lower().strip()
        search_tokens = [tok for tok in re.split(r'[^a-zA-Z0-9а-яА-ЯөүӨҮёЁ\d]+', subject_cleaned) if len(tok) >= 2]
        
        for s in supervised_students:
            # Topic similarity calculation
            topic_title = (s.topic_title or "").lower()
            sim_score = 0
            if search_tokens:
                for token in search_tokens:
                    if token in topic_title:
                        sim_score += 2  # Higher weight for exact token match in supervised topic
                    elif token in (s.category or "").lower():
                        sim_score += 0.5
            similarity_bonus_scores.append(sim_score)
            
            # Grade calculation
            overall_eval = db.query(OverallEvaluation).filter(OverallEvaluation.student_id == s.id).first()
            if overall_eval and overall_eval.score_total is not None:
                total_grades.append(float(overall_eval.score_total))

        # Хэрэв багш өмнө нь оюутан удирдаж байгаагүй бол анхны утгаар 85.0 оноо өгнө
        avg_student_grade = float(round(sum(total_grades) / len(total_grades), 1)) if total_grades else 85.0
        
        # Төстэй сэдэв удирдаж байсан туршлагыг үнэлэх урамшууллын оноо (хамгийн ихдээ 15 оноо)
        avg_sim_bonus = sum(similarity_bonus_scores) / len(similarity_bonus_scores) if similarity_bonus_scores else 0
        topic_bonus_component = min(15.0, avg_sim_bonus * 5.0) # Өмнөх сэдвүүд хэр төстэй байгаагаас хамаарч урамшуулал өгнө

        # C. Suitability score calculation
        # Оюутан багшийг сонгох гол шалгуур нь тухайн сэдвийг удирдуулбал хэр сайн хамгаалдаг вэ гэдэг дээр төвлөрнө.
        # Suitability = (Удирдсан оюутнуудын дундаж оноо (out of 100) * 0.65) + (Topic Match Bonus * 0.35)
        grade_component = avg_student_grade  # Already out of 100
        
        suitability_score = float(round((grade_component * 0.65) + (topic_bonus_component / 15.0 * 100 * 0.35), 1))

        recommended_teachers.append({
            "teacherId": f"t{t.id}",
            "name": t.name,
            "expertise": t.expertise,
            "averageStudentGrade": avg_student_grade,
            "topicMatchBonus": float(round(topic_bonus_component, 1)),
            "studentCount": student_count,
            "suitabilityScore": suitability_score
        })

    # Sort recommended teachers by suitability score descending
    recommended_teachers.sort(key=lambda x: x["suitabilityScore"], reverse=True)

    # 3. Inspirational Theses (Tokenize subject query and rank candidates by keyword similarity)
    subject_cleaned = subject.lower().strip()
    tokens = [tok for tok in re.split(r'[^a-zA-Z0-9а-яА-ЯөүӨҮёЁ\d]+', subject_cleaned) if len(tok) >= 2]

    # Query all candidate students and their overall evaluation scores
    theses_query = db.query(Student, OverallEvaluation.score_total).join(
        OverallEvaluation, Student.id == OverallEvaluation.student_id
    )
    if year is not None:
        theses_query = theses_query.filter(Student.year == year)
    if sem is not None:
        theses_query = theses_query.filter(Student.semester == sem)

    candidates = theses_query.all()
    scored_candidates = []

    for ts, score_total in candidates:
        title = (ts.topic_title or "").lower()
        sim_score = 0
        if tokens:
            for token in tokens:
                if token in title:
                    sim_score += 1
                elif token in (ts.category or "").lower():
                    sim_score += 0.5  # minor weight for category name match

        score = float(score_total) if score_total is not None else 90.0
        scored_candidates.append({
            "student": ts,
            "sim_score": sim_score,
            "totalGrade": score
        })

    # Sort order: 1. keyword similarity score descending, 2. total grade descending
    scored_candidates.sort(key=lambda x: (x["sim_score"], x["totalGrade"]), reverse=True)

    inspirational_theses = []
    for item in scored_candidates[:3]:
        ts = item["student"]
        inspirational_theses.append({
            "studentId": f"s{ts.id}",
            "name": ts.name,
            "thesisTitle": ts.topic_title,
            "classCode": ts.program,
            "topic": ts.category,
            "totalGrade": item["totalGrade"]
        })

    return {
        "detectedField": detected_field,
        "fieldLabel": field_label,
        "recommendedTeachers": recommended_teachers[:limit],
        "inspirationalTheses": inspirational_theses
    }
