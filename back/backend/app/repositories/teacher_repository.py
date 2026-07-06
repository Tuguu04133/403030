from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.teacher import Teacher
from app.schemas.teacher import TeacherCreate, TeacherUpdate


def list_teachers(
    db: Session,
    *,
    limit: int,
    offset: int,
    expertise: str | None = None,
    gender: str | None = None,
) -> list[Teacher]:
    stmt = select(Teacher).order_by(Teacher.id).limit(limit).offset(offset)
    if expertise:
        stmt = stmt.where(Teacher.expertise == expertise)
    if gender:
        stmt = stmt.where(Teacher.gender == gender)
    return list(db.scalars(stmt).all())


def get_teacher(db: Session, teacher_id: int) -> Teacher | None:
    return db.get(Teacher, teacher_id)


def create_teacher(db: Session, payload: TeacherCreate) -> Teacher:
    teacher = Teacher(**payload.model_dump())
    db.add(teacher)
    db.commit()
    db.refresh(teacher)
    return teacher


def update_teacher(db: Session, teacher: Teacher, payload: TeacherUpdate) -> Teacher:
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(teacher, field, value)
    db.commit()
    db.refresh(teacher)
    return teacher


def delete_teacher(db: Session, teacher: Teacher) -> None:
    db.delete(teacher)
    db.commit()
