from sqlalchemy.orm import Session

from app.repositories import committee_repository, teacher_repository
from app.schemas.committee import (
    CommitteeCreate,
    CommitteeMemberCreate,
    CommitteeMemberUpdate,
    CommitteeUpdate,
)
from app.services.exceptions import BadRequestError, NotFoundError


def list_committees(
    db: Session,
    *,
    limit: int,
    offset: int,
    year: int | None,
    semester: str | None,
):
    return committee_repository.list_committees(
        db,
        limit=limit,
        offset=offset,
        year=year,
        semester=semester,
    )


def get_committee(db: Session, committee_id: int):
    committee = committee_repository.get_committee(db, committee_id)
    if not committee:
        raise NotFoundError("Committee not found")
    return committee


def get_committee_detail(db: Session, committee_id: int):
    committee = committee_repository.get_committee_detail(db, committee_id)
    if not committee:
        raise NotFoundError("Committee not found")
    return committee


def create_committee(db: Session, payload: CommitteeCreate):
    return committee_repository.create_committee(db, payload)


def update_committee(db: Session, committee_id: int, payload: CommitteeUpdate):
    committee = get_committee(db, committee_id)
    return committee_repository.update_committee(db, committee, payload)


def delete_committee(db: Session, committee_id: int) -> None:
    committee = get_committee(db, committee_id)
    committee_repository.delete_committee(db, committee)


def list_members(db: Session, committee_id: int):
    get_committee(db, committee_id)
    return committee_repository.list_members(db, committee_id)


def get_member(db: Session, member_id: int):
    member = committee_repository.get_member(db, member_id)
    if not member:
        raise NotFoundError("Committee member not found")
    return member


def create_member(db: Session, committee_id: int, payload: CommitteeMemberCreate):
    get_committee(db, committee_id)
    if payload.committee_id != committee_id:
        raise BadRequestError("committee_id must match path parameter")
    if payload.is_external:
        payload.teacher_id = None
    elif not teacher_repository.get_teacher(db, payload.teacher_id):
        raise NotFoundError("Teacher not found")
    return committee_repository.create_member(db, payload)


def update_member(db: Session, member_id: int, payload: CommitteeMemberUpdate):
    member = get_member(db, member_id)
    data = payload.model_dump(exclude_unset=True)
    updated_is_external = data.get("is_external", member.is_external)
    updated_teacher_id = data.get("teacher_id", member.teacher_id)
    updated_external_name = data.get("external_name", member.external_name)

    if updated_teacher_id is not None and not teacher_repository.get_teacher(
        db,
        updated_teacher_id,
    ):
        raise NotFoundError("Teacher not found")
    if updated_is_external and not updated_external_name:
        raise BadRequestError("external_name is required for external members")
    if not updated_is_external and updated_teacher_id is None:
        raise BadRequestError("teacher_id is required for internal members")

    if updated_is_external:
        member.teacher_id = None
    return committee_repository.update_member(db, member, payload)


def delete_member(db: Session, member_id: int) -> None:
    member = get_member(db, member_id)
    committee_repository.delete_member(db, member)
