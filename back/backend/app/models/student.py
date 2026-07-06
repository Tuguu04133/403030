from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class Student(Base):
    __tablename__ = "students"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    gender: Mapped[str] = mapped_column(String(10), nullable=False)
    year: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    semester: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    level: Mapped[str] = mapped_column(String(30), nullable=False)
    topic_title: Mapped[str] = mapped_column(String(250), nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    program: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    committee_id: Mapped[int] = mapped_column(
        ForeignKey("committees.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )
    supervisor_id: Mapped[int | None] = mapped_column(
        ForeignKey("teachers.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    reviewer_id: Mapped[int | None] = mapped_column(
        ForeignKey("teachers.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    committee = relationship("Committee", back_populates="students")
    supervisor = relationship(
        "Teacher",
        back_populates="supervised_students",
        foreign_keys=[supervisor_id],
    )
    reviewer = relationship(
        "Teacher",
        back_populates="reviewed_students",
        foreign_keys=[reviewer_id],
    )
