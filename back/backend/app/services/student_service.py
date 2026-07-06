from sqlalchemy.orm import Session

from app.repositories import committee_repository, student_repository, teacher_repository
from app.schemas.student import StudentCreate, StudentUpdate
from app.services.exceptions import NotFoundError


def list_students(
    db: Session,
    *,
    limit: int,
    offset: int,
    year: int | None,
    semester: str | None,
    category: str | None,
    committee_id: int | None,
):
    return student_repository.list_students(
        db,
        limit=limit,
        offset=offset,
        year=year,
        semester=semester,
        category=category,
        committee_id=committee_id,
    )


def get_student(db: Session, student_id: int):
    student = student_repository.get_student(db, student_id)
    if not student:
        raise NotFoundError("Student not found")
    return student


def get_student_detail(db: Session, student_id: int):
    student = student_repository.get_student_detail(db, student_id)
    if not student:
        raise NotFoundError("Student not found")
    return student


def create_student(db: Session, payload: StudentCreate):
    _validate_relations(
        db,
        committee_id=payload.committee_id,
        supervisor_id=payload.supervisor_id,
        reviewer_id=payload.reviewer_id,
    )
    return student_repository.create_student(db, payload)


def update_student(db: Session, student_id: int, payload: StudentUpdate):
    student = get_student(db, student_id)
    data = payload.model_dump(exclude_unset=True)
    _validate_relations(
        db,
        committee_id=data.get("committee_id"),
        supervisor_id=data.get("supervisor_id"),
        reviewer_id=data.get("reviewer_id"),
    )
    return student_repository.update_student(db, student, payload)


def delete_student(db: Session, student_id: int) -> None:
    student = get_student(db, student_id)
    student_repository.delete_student(db, student)


def _validate_relations(
    db: Session,
    *,
    committee_id: int | None,
    supervisor_id: int | None,
    reviewer_id: int | None,
) -> None:
    if committee_id is not None and not committee_repository.get_committee(
        db,
        committee_id,
    ):
        raise NotFoundError("Committee not found")
    if supervisor_id is not None and not teacher_repository.get_teacher(
        db,
        supervisor_id,
    ):
        raise NotFoundError("Supervisor not found")
    if reviewer_id is not None and not teacher_repository.get_teacher(db, reviewer_id):
        raise NotFoundError("Reviewer not found")
