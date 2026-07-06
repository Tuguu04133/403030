from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.models.student import Student
from app.schemas.student import StudentCreate, StudentUpdate


def list_students(
    db: Session,
    *,
    limit: int,
    offset: int,
    year: int | None = None,
    semester: str | None = None,
    category: str | None = None,
    committee_id: int | None = None,
) -> list[Student]:
    stmt = select(Student).order_by(Student.id)
    if year:
        stmt = stmt.where(Student.year == year)
    if semester:
        stmt = stmt.where(Student.semester == semester)
    if category:
        stmt = stmt.where(Student.category == category)
    if committee_id:
        stmt = stmt.where(Student.committee_id == committee_id)
    stmt = stmt.limit(limit).offset(offset)
    return list(db.scalars(stmt).all())


def get_student(db: Session, student_id: int) -> Student | None:
    return db.get(Student, student_id)


def get_student_detail(db: Session, student_id: int) -> Student | None:
    stmt = (
        select(Student)
        .options(
            joinedload(Student.committee),
            joinedload(Student.supervisor),
            joinedload(Student.reviewer),
        )
        .where(Student.id == student_id)
    )
    return db.scalars(stmt).one_or_none()


def create_student(db: Session, payload: StudentCreate) -> Student:
    student = Student(**payload.model_dump())
    db.add(student)
    db.commit()
    db.refresh(student)
    return student


def update_student(db: Session, student: Student, payload: StudentUpdate) -> Student:
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(student, field, value)
    db.commit()
    db.refresh(student)
    return student


def delete_student(db: Session, student: Student) -> None:
    db.delete(student)
    db.commit()
