from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.committee import (
    CommitteeCreate,
    CommitteeDetail,
    CommitteeMemberCreate,
    CommitteeMemberRead,
    CommitteeMemberUpdate,
    CommitteeRead,
    CommitteeUpdate,
)
from app.services import committee_service

router = APIRouter()


@router.get("", response_model=list[CommitteeRead])
def list_committees(
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
    year: int | None = None,
    semester: str | None = None,
    db: Session = Depends(get_db),
):
    return committee_service.list_committees(
        db,
        limit=limit,
        offset=offset,
        year=year,
        semester=semester,
    )


@router.post("", response_model=CommitteeRead, status_code=status.HTTP_201_CREATED)
def create_committee(payload: CommitteeCreate, db: Session = Depends(get_db)):
    return committee_service.create_committee(db, payload)


@router.get("/{committee_id}", response_model=CommitteeDetail)
def get_committee(committee_id: int, db: Session = Depends(get_db)):
    return committee_service.get_committee_detail(db, committee_id)


@router.patch("/{committee_id}", response_model=CommitteeRead)
def update_committee(
    committee_id: int,
    payload: CommitteeUpdate,
    db: Session = Depends(get_db),
):
    return committee_service.update_committee(db, committee_id, payload)


@router.delete("/{committee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_committee(committee_id: int, db: Session = Depends(get_db)):
    committee_service.delete_committee(db, committee_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/{committee_id}/members", response_model=list[CommitteeMemberRead])
def list_members(committee_id: int, db: Session = Depends(get_db)):
    return committee_service.list_members(db, committee_id)


@router.post(
    "/{committee_id}/members",
    response_model=CommitteeMemberRead,
    status_code=status.HTTP_201_CREATED,
)
def create_member(
    committee_id: int,
    payload: CommitteeMemberCreate,
    db: Session = Depends(get_db),
):
    return committee_service.create_member(db, committee_id, payload)


@router.patch("/members/{member_id}", response_model=CommitteeMemberRead)
def update_member(
    member_id: int,
    payload: CommitteeMemberUpdate,
    db: Session = Depends(get_db),
):
    return committee_service.update_member(db, member_id, payload)


@router.delete("/members/{member_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_member(member_id: int, db: Session = Depends(get_db)):
    committee_service.delete_member(db, member_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
