from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.models.committee import Committee, CommitteeMember
from app.schemas.committee import (
    CommitteeCreate,
    CommitteeMemberCreate,
    CommitteeMemberUpdate,
    CommitteeUpdate,
)


def list_committees(
    db: Session,
    *,
    limit: int,
    offset: int,
    year: int | None = None,
    semester: str | None = None,
) -> list[Committee]:
    stmt = select(Committee).order_by(
        Committee.period_year,
        Committee.period_sem,
        Committee.committee_no,
    )
    if year:
        stmt = stmt.where(Committee.period_year == year)
    if semester:
        stmt = stmt.where(Committee.period_sem == semester)
    stmt = stmt.limit(limit).offset(offset)
    return list(db.scalars(stmt).all())


def get_committee(db: Session, committee_id: int) -> Committee | None:
    return db.get(Committee, committee_id)


def get_committee_detail(db: Session, committee_id: int) -> Committee | None:
    stmt = (
        select(Committee)
        .options(
            joinedload(Committee.members).joinedload(CommitteeMember.teacher),
        )
        .where(Committee.id == committee_id)
    )
    return db.scalars(stmt).unique().one_or_none()


def create_committee(db: Session, payload: CommitteeCreate) -> Committee:
    committee = Committee(**payload.model_dump())
    db.add(committee)
    db.commit()
    db.refresh(committee)
    return committee


def update_committee(
    db: Session,
    committee: Committee,
    payload: CommitteeUpdate,
) -> Committee:
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(committee, field, value)
    db.commit()
    db.refresh(committee)
    return committee


def delete_committee(db: Session, committee: Committee) -> None:
    db.delete(committee)
    db.commit()


def list_members(db: Session, committee_id: int) -> list[CommitteeMember]:
    stmt = (
        select(CommitteeMember)
        .options(joinedload(CommitteeMember.teacher))
        .where(CommitteeMember.committee_id == committee_id)
        .order_by(CommitteeMember.id)
    )
    return list(db.scalars(stmt).all())


def get_member(db: Session, member_id: int) -> CommitteeMember | None:
    stmt = (
        select(CommitteeMember)
        .options(joinedload(CommitteeMember.teacher))
        .where(CommitteeMember.id == member_id)
    )
    return db.scalars(stmt).one_or_none()


def create_member(db: Session, payload: CommitteeMemberCreate) -> CommitteeMember:
    member = CommitteeMember(**payload.model_dump())
    db.add(member)
    db.commit()
    db.refresh(member)
    return member


def update_member(
    db: Session,
    member: CommitteeMember,
    payload: CommitteeMemberUpdate,
) -> CommitteeMember:
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(member, field, value)
    db.commit()
    db.refresh(member)
    return member


def delete_member(db: Session, member: CommitteeMember) -> None:
    db.delete(member)
    db.commit()
