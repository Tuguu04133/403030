from sqlalchemy.orm import Session

from app.repositories import teacher_repository
from app.schemas.teacher import TeacherCreate, TeacherUpdate
from app.services.exceptions import NotFoundError


def list_teachers(
    db: Session,
    *,
    limit: int,
    offset: int,
    expertise: str | None,
    gender: str | None,
):
    return teacher_repository.list_teachers(
        db,
        limit=limit,
        offset=offset,
        expertise=expertise,
        gender=gender,
    )


def get_teacher(db: Session, teacher_id: int):
    teacher = teacher_repository.get_teacher(db, teacher_id)
    if not teacher:
        raise NotFoundError("Teacher not found")
    return teacher


def create_teacher(db: Session, payload: TeacherCreate):
    return teacher_repository.create_teacher(db, payload)


def update_teacher(db: Session, teacher_id: int, payload: TeacherUpdate):
    teacher = get_teacher(db, teacher_id)
    return teacher_repository.update_teacher(db, teacher, payload)


def delete_teacher(db: Session, teacher_id: int) -> None:
    teacher = get_teacher(db, teacher_id)
    teacher_repository.delete_teacher(db, teacher)
