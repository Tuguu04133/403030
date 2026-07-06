from sqlalchemy import Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class Teacher(Base):
    __tablename__ = "teachers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    gender: Mapped[str] = mapped_column(String(10), nullable=False)
    expertise: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    behavior: Mapped[str] = mapped_column(String(30), nullable=False)
    bias: Mapped[float] = mapped_column(Float, nullable=False, default=0)
    std: Mapped[float] = mapped_column(Float, nullable=False, default=0)
    gpref: Mapped[str | None] = mapped_column(String(10), nullable=True)
    gbonus: Mapped[float] = mapped_column(Float, nullable=False, default=0)

    committee_memberships = relationship(
        "CommitteeMember",
        back_populates="teacher",
        cascade="all, delete-orphan",
    )
    supervised_students = relationship(
        "Student",
        back_populates="supervisor",
        foreign_keys="Student.supervisor_id",
    )
    reviewed_students = relationship(
        "Student",
        back_populates="reviewer",
        foreign_keys="Student.reviewer_id",
    )
