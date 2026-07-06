from sqlalchemy import ForeignKey, Integer, String, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class KomissinEhiinUzleg(Base):
    __tablename__ = "komissin_ehiin_uzleg"

    student_id: Mapped[int] = mapped_column(
        ForeignKey("students.id", ondelete="CASCADE"), primary_key=True
    )
    program: Mapped[str | None] = mapped_column(String(255), nullable=True)
    name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    supervisor_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    score_theory_and_topic_mastery: Mapped[int] = mapped_column(Integer, nullable=False)
    score_plan_execution: Mapped[int] = mapped_column(Integer, nullable=False)
    score_presentation_and_answers: Mapped[int] = mapped_column(Integer, nullable=False)
    score_total: Mapped[int] = mapped_column(Integer, nullable=False)

    student = relationship("Student")


class KomissinGishvvdUzleg(Base):
    __tablename__ = "komissin_gishvvd_uzleg"

    student_id: Mapped[int] = mapped_column(
        ForeignKey("students.id", ondelete="CASCADE"), primary_key=True
    )
    program: Mapped[str | None] = mapped_column(String(255), nullable=True)
    name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    supervisor_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    member_1_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    member_2_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    member_3_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    member_4_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    average_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)

    student = relationship("Student")


class UridchilsanHamgaalalt(Base):
    __tablename__ = "uridchilsan_hamgaalalt"

    student_id: Mapped[int] = mapped_column(
        ForeignKey("students.id", ondelete="CASCADE"), primary_key=True
    )
    program: Mapped[str | None] = mapped_column(String(255), nullable=True)
    name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    supervisor_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    progress_1: Mapped[int] = mapped_column(Integer, nullable=False)
    progress_2: Mapped[int] = mapped_column(Integer, nullable=False)
    score_theory_and_topic_mastery: Mapped[int] = mapped_column(Integer, nullable=False)
    score_work_done_since_review: Mapped[int] = mapped_column(Integer, nullable=False)
    score_report_writing: Mapped[int] = mapped_column(Integer, nullable=False)
    score_presentation_and_answers: Mapped[int] = mapped_column(Integer, nullable=False)
    score_total: Mapped[int] = mapped_column(Integer, nullable=False)

    student = relationship("Student")


class UridchilsanKomissinGishvvd(Base):
    __tablename__ = "uridchilsan_komissin_gishvvd"

    student_id: Mapped[int] = mapped_column(
        ForeignKey("students.id", ondelete="CASCADE"), primary_key=True
    )
    program: Mapped[str | None] = mapped_column(String(255), nullable=True)
    name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    supervisor_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    progress_1: Mapped[int] = mapped_column(Integer, nullable=False)
    progress_2: Mapped[int] = mapped_column(Integer, nullable=False)
    member_1_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    member_2_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    member_3_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    member_4_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    average_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)

    student = relationship("Student")


class JinkheneHamgaalalt(Base):
    __tablename__ = "jinkhene_hamgaalalt"

    student_id: Mapped[int] = mapped_column(
        ForeignKey("students.id", ondelete="CASCADE"), primary_key=True
    )
    program: Mapped[str | None] = mapped_column(String(255), nullable=True)
    name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    supervisor_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    score_novelty_and_practical_value: Mapped[int] = mapped_column(Integer, nullable=False)
    score_theoretical_knowledge_and_results: Mapped[int] = mapped_column(Integer, nullable=False)
    score_presentation_prep_and_delivery: Mapped[int] = mapped_column(Integer, nullable=False)
    score_report_writing: Mapped[int] = mapped_column(Integer, nullable=False)
    score_additional_answers: Mapped[int] = mapped_column(Integer, nullable=False)
    score_total: Mapped[int] = mapped_column(Integer, nullable=False)

    student = relationship("Student")


class JinkheneKomissinGishvvd(Base):
    __tablename__ = "jinkhene_komissin_gishvvd"

    student_id: Mapped[int] = mapped_column(
        ForeignKey("students.id", ondelete="CASCADE"), primary_key=True
    )
    program: Mapped[str | None] = mapped_column(String(255), nullable=True)
    name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    supervisor_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    member_1_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    member_2_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    member_3_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    member_4_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    average_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)

    student = relationship("Student")


class ReviewerEvaluation(Base):
    __tablename__ = "reviewer_evaluations"

    student_id: Mapped[int] = mapped_column(
        ForeignKey("students.id", ondelete="CASCADE"), primary_key=True
    )
    program: Mapped[str | None] = mapped_column(String(255), nullable=True)
    name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    supervisor_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    reviewer_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    score: Mapped[int] = mapped_column(Integer, nullable=False)

    student = relationship("Student")


class Progress1Evaluation(Base):
    __tablename__ = "progress_1_evaluations"

    student_id: Mapped[int] = mapped_column(
        ForeignKey("students.id", ondelete="CASCADE"), primary_key=True
    )
    program: Mapped[str | None] = mapped_column(String(255), nullable=True)
    name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    supervisor_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    score: Mapped[int] = mapped_column(Integer, nullable=False)

    student = relationship("Student")


class OverallEvaluation(Base):
    __tablename__ = "overall_evaluations"

    student_id: Mapped[int] = mapped_column(
        ForeignKey("students.id", ondelete="CASCADE"), primary_key=True
    )
    program: Mapped[str | None] = mapped_column(String(255), nullable=True)
    name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    supervisor_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    score_progress_1: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    score_committee_review: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    score_pre_defense: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    score_reviewer: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    score_final_defense: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    score_total: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)

    student = relationship("Student")


class TeacherBiasAnalysis(Base):
    __tablename__ = "teacher_bias_analysis"

    teacher_id: Mapped[int] = mapped_column(
        ForeignKey("teachers.id", ondelete="CASCADE"), primary_key=True
    )
    calculated_bias: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    calculated_std: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    total_evaluations: Mapped[int] = mapped_column(Integer, nullable=False)

    teacher = relationship("Teacher")
