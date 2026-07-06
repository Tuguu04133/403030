from sqlalchemy import Boolean, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class Committee(Base):
    __tablename__ = "committees"
    __table_args__ = (
        UniqueConstraint(
            "period_year",
            "period_sem",
            "committee_no",
            name="uq_committees_period_no",
        ),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    period_year: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    period_sem: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    committee_no: Mapped[int] = mapped_column(Integer, nullable=False)
    name: Mapped[str] = mapped_column(String(160), nullable=False)

    members = relationship(
        "CommitteeMember",
        back_populates="committee",
        cascade="all, delete-orphan",
    )
    students = relationship("Student", back_populates="committee")


class CommitteeMember(Base):
    __tablename__ = "committee_members"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    committee_id: Mapped[int] = mapped_column(
        ForeignKey("committees.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    teacher_id: Mapped[int | None] = mapped_column(
        ForeignKey("teachers.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    is_external: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    external_name: Mapped[str | None] = mapped_column(String(120), nullable=True)

    committee = relationship("Committee", back_populates="members")
    teacher = relationship("Teacher", back_populates="committee_memberships")
