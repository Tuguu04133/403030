import re
from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.student import Student
from app.models.teacher import Teacher
from app.models.committee import Committee, CommitteeMember
from app.models.evaluation import (
    OverallEvaluation,
    Progress1Evaluation,
    KomissinGishvvdUzleg,
    UridchilsanKomissinGishvvd,
    ReviewerEvaluation,
    JinkheneKomissinGishvvd,
)
from app.schemas.student import StudentCreate, StudentDetail, StudentRead, StudentUpdate, StudentSearchResponse
from app.schemas.common import SearchRequest
from app.services import student_service

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


@router.get("")
def list_students(
    year: int | None = None,
    semester: str | None = None,
    page: int = Query(default=1, ge=1),
    size: int = Query(default=15, ge=1, le=100),
    search: str | None = None,
    topic: str | None = None,
    level: str | None = None,
    db: Session = Depends(get_db),
):
    """6. Paginated Student List: Supports search, topic filtering, and grade level filtering."""
    sem = standardize_semester(semester)

    query = db.query(Student).join(OverallEvaluation, Student.id == OverallEvaluation.student_id)

    if year is not None:
        query = query.filter(Student.year == year)
    if sem is not None:
        query = query.filter(Student.semester == sem)
    if search:
        query = query.filter(
            or_(
                Student.name.ilike(f"%{search}%"),
                Student.topic_title.ilike(f"%{search}%"),
                Student.program.ilike(f"%{search}%")
            )
        )
    if topic:
        query = query.filter(Student.category == topic)
    if level:
        query = query.filter(Student.level.ilike(f"%{level}%"))

    total_elements = query.count()
    offset = (page - 1) * size
    students = query.offset(offset).limit(size).all()
    total_pages = (total_elements + size - 1) // size if total_elements > 0 else 0

    content = []
    for s in students:
        overall = db.query(OverallEvaluation).filter(OverallEvaluation.student_id == s.id).first()
        score = float(overall.score_total) if overall else 0.0

        supervisor = db.query(Teacher).filter(Teacher.id == s.supervisor_id).first()
        sup_name = supervisor.name if supervisor else "Багш"

        committee = db.query(Committee).filter(Committee.id == s.committee_id).first()
        c_no = committee.committee_no if committee else 1

        content.append({
            "id": f"s{s.id}",
            "name": s.name,
            "thesisTitle": s.topic_title,
            "classCode": s.program,
            "topic": s.category,
            "committeeId": c_no,
            "supervisorName": sup_name,
            "totalScore": score,
            "level": s.level.capitalize()
        })

    return {
        "content": content,
        "pagination": {
            "page": page,
            "size": size,
            "totalElements": total_elements,
            "totalPages": total_pages
        }
    }


@router.get("/{student_id}/grades")
def get_student_grades(student_id: str, db: Session = Depends(get_db)):
    """7. Student 5-Stage Grade Breakdown: Fetches detailed scorecard breakdowns."""
    # Parse student ID (handles both integer like 1, or string like 's1')
    id_match = re.search(r"\d+", student_id)
    if not id_match:
        raise HTTPException(status_code=400, detail="Invalid student ID format")
    s_id = int(id_match.group(0))

    student = db.query(Student).filter(Student.id == s_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    p1 = db.query(Progress1Evaluation).filter(Progress1Evaluation.student_id == s_id).first()
    kg = db.query(KomissinGishvvdUzleg).filter(KomissinGishvvdUzleg.student_id == s_id).first()
    uk = db.query(UridchilsanKomissinGishvvd).filter(UridchilsanKomissinGishvvd.student_id == s_id).first()
    re_eval = db.query(ReviewerEvaluation).filter(ReviewerEvaluation.student_id == s_id).first()
    jk = db.query(JinkheneKomissinGishvvd).filter(JinkheneKomissinGishvvd.student_id == s_id).first()

    supervisor = db.query(Teacher).filter(Teacher.id == student.supervisor_id).first()
    sup_name = supervisor.name if supervisor else "Багш"

    reviewer = db.query(Teacher).filter(Teacher.id == student.reviewer_id).first()
    rev_name = reviewer.name if reviewer else (re_eval.reviewer_name if re_eval else "Шүүмжлэгч багш")

    final_grades = []
    if jk:
        members = db.query(CommitteeMember).filter(CommitteeMember.committee_id == student.committee_id).all()
        scores = [jk.member_1_score, jk.member_2_score, jk.member_3_score, jk.member_4_score]
        
        for idx, m in enumerate(members):
            if idx >= 4:
                break
            score_val = float(scores[idx]) if idx < len(scores) else 0.0
            
            if m.is_external:
                t_id = f"ext{m.id}"
                t_name = m.external_name or f"Гадаад гишүүн {idx+1}"
                t_exp = student.category
                is_exp = True
            else:
                t_info = db.query(Teacher).filter(Teacher.id == m.teacher_id).first()
                t_id = f"t{t_info.id}" if t_info else f"t{m.teacher_id}"
                t_name = t_info.name if t_info else f"Багш {m.teacher_id}"
                t_exp = t_info.expertise if t_info else ""
                is_exp = t_info.expertise == student.category if t_info else False

            final_grades.append({
                "teacherId": t_id,
                "teacherName": t_name,
                "expertise": t_exp,
                "isExpert": is_exp,
                "grade": score_val
            })

    committee = db.query(Committee).filter(Committee.id == student.committee_id).first()
    c_no = committee.committee_no if committee else 1

    return {
        "studentId": f"s{student.id}",
        "name": student.name,
        "thesisTitle": student.topic_title,
        "classCode": student.program,
        "topic": student.category,
        "committeeId": c_no,
        "supervisorName": sup_name,
        "supervisorGrade": p1.score if p1 else 15,
        "firstReviewGrade": float(kg.average_score) if kg else 0.0,
        "preDefenseGrade": float(uk.average_score) if uk else 0.0,
        "reviewerName": rev_name,
        "reviewerGrade": re_eval.score if re_eval else 5,
        "finalDefenseAverage": float(jk.average_score) if jk else 0.0,
        "finalDefenseGrades": final_grades
    }


@router.post("", response_model=StudentRead, status_code=status.HTTP_201_CREATED)
def create_student(payload: StudentCreate, db: Session = Depends(get_db)):
    return student_service.create_student(db, payload)


@router.get("/{student_id}", response_model=StudentDetail)
def get_student(student_id: int, db: Session = Depends(get_db)):
    return student_service.get_student_detail(db, student_id)


@router.patch("/{student_id}", response_model=StudentRead)
def update_student(
    student_id: int,
    payload: StudentUpdate,
    db: Session = Depends(get_db),
):
    return student_service.update_student(db, student_id, payload)


@router.delete("/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_student(student_id: int, db: Session = Depends(get_db)):
    student_service.delete_student(db, student_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/search", response_model=StudentSearchResponse)
def search_students(payload: SearchRequest, db: Session = Depends(get_db)):
    """Search and paginate students by a key representing year and semester (e.g. '2026 хавар')"""
    key = payload.key.strip()
    
    if key.lower() in ["бүгд", "all", ""]:
        year = None
        semester = None
    else:
        year_match = re.search(r"\b(20\d{2})\b", key)
        year = int(year_match.group(1)) if year_match else None

        semester = None
        key_lower = key.lower()
        if "хавар" in key_lower or "spring" in key_lower:
            semester = "SPRING"
        elif "намар" in key_lower or "fall" in key_lower or "autumn" in key_lower:
            semester = "FALL"

    query = db.query(Student)

    if year is not None:
        query = query.filter(Student.year == year)
    if semester is not None:
        query = query.filter(Student.semester == semester)

    total = query.count()
    items = query.offset(payload.offset).limit(payload.limit).all()

    return StudentSearchResponse(
        items=items,
        total=total,
        limit=payload.limit,
        offset=payload.offset
    )


@router.get("/grades-report")
def get_student_grades_report(
    year: int | None = None,
    semester: str | None = None,
    db: Session = Depends(get_db),
):
    """Get the full 5-stage grade report of all students for a specific year and semester."""
    sem = standardize_semester(semester)

    query = db.query(Student).join(OverallEvaluation, Student.id == OverallEvaluation.student_id)

    if year is not None:
        query = query.filter(Student.year == year)
    if sem is not None:
        query = query.filter(Student.semester == sem)

    students = query.all()

    report = []
    for s in students:
        overall = db.query(OverallEvaluation).filter(OverallEvaluation.student_id == s.id).first()
        if overall:
            report.append({
                "studentId": f"s{s.id}",
                "name": s.name,
                "program": s.program,
                "topicTitle": s.topic_title,
                "category": s.category,
                "scoreProgress1": float(overall.score_progress_1),
                "scoreCommitteeReview": float(overall.score_committee_review),
                "scorePreDefense": float(overall.score_pre_defense),
                "scoreReviewer": float(overall.score_reviewer),
                "scoreFinalDefense": float(overall.score_final_defense),
                "scoreTotal": float(overall.score_total),
                "level": s.level.capitalize() if s.level else "Average"
            })

    return {
        "year": year,
        "semester": sem,
        "studentCount": len(report),
        "grades": report
    }

