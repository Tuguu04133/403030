import csv
import sys
from pathlib import Path

BACKEND_ROOT = Path(__file__).resolve().parents[1]
BACK_ROOT = BACKEND_ROOT.parent
sys.path.append(str(BACKEND_ROOT))

from app.db.base import Base  # noqa: E402
from app.db.session import SessionLocal, engine  # noqa: E402
from app.models.committee import Committee, CommitteeMember  # noqa: E402
from app.models.student import Student  # noqa: E402
from app.models.teacher import Teacher  # noqa: E402

MOCK_DATA_DIR = BACK_ROOT / "mock _datas"


def main() -> None:
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        _seed_teachers(db)
        _seed_committees(db)
        _seed_committee_members(db)
        _seed_students(db)
        db.commit()
    print("Seed completed")


def _seed_teachers(db) -> None:
    for row in _read_csv("01_teachers.csv"):
        db.merge(
            Teacher(
                id=_int(row["id"]),
                name=row["name"],
                gender=row["gender"],
                expertise=row["expertise"],
                behavior=row["behavior"],
                bias=_float(row["bias"]),
                std=_float(row["std"]),
                gpref=_blank_to_none(row["gpref"]),
                gbonus=_float(row["gbonus"]),
            )
        )


def _seed_committees(db) -> None:
    for row in _read_csv("02_committees.csv"):
        db.merge(
            Committee(
                id=_int(row["id"]),
                period_year=_int(row["period_year"]),
                period_sem=row["period_sem"],
                committee_no=_int(row["committee_no"]),
                name=row["name"],
            )
        )


def _seed_committee_members(db) -> None:
    for row in _read_csv("03_committee_members.csv"):
        db.merge(
            CommitteeMember(
                id=_int(row["id"]),
                committee_id=_int(row["committee_id"]),
                teacher_id=_optional_int(row["teacher_id"]),
                is_external=_bool(row["is_external"]),
                external_name=_blank_to_none(row["external_name"]),
            )
        )


def _seed_students(db) -> None:
    for row in _read_csv("04_students.csv"):
        db.merge(
            Student(
                id=_int(row["id"]),
                name=row["name"],
                gender=row["gender"],
                year=_int(row["year"]),
                semester=row["semester"],
                level=row["level"],
                topic_title=row["topic_title"],
                category=row["category"],
                program=row["program"],
                committee_id=_int(row["committee_id"]),
                supervisor_id=_optional_int(row["supervisor_id"]),
                reviewer_id=_optional_int(row["reviewer_id"]),
            )
        )


def _read_csv(filename: str) -> list[dict[str, str]]:
    with (MOCK_DATA_DIR / filename).open(encoding="utf-8-sig", newline="") as file:
        return list(csv.DictReader(file))


def _blank_to_none(value: str) -> str | None:
    value = value.strip()
    return value or None


def _int(value: str) -> int:
    return int(value)


def _optional_int(value: str) -> int | None:
    value = value.strip()
    return int(value) if value else None


def _float(value: str) -> float:
    return float(value)


def _bool(value: str) -> bool:
    return value.strip().lower() in {"1", "true", "yes"}


if __name__ == "__main__":
    main()
