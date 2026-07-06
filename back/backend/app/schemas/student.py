from pydantic import BaseModel, ConfigDict, Field

from app.schemas.committee import CommitteeRead
from app.schemas.teacher import TeacherRead


class StudentBase(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    gender: str = Field(min_length=1, max_length=10)
    year: int = Field(ge=2000, le=2100)
    semester: str = Field(min_length=1, max_length=20)
    level: str = Field(min_length=1, max_length=30)
    topic_title: str = Field(min_length=1, max_length=250)
    category: str = Field(min_length=1, max_length=50)
    program: str = Field(min_length=1, max_length=120)
    committee_id: int
    supervisor_id: int | None = None
    reviewer_id: int | None = None


class StudentCreate(StudentBase):
    pass


class StudentUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=120)
    gender: str | None = Field(default=None, min_length=1, max_length=10)
    year: int | None = Field(default=None, ge=2000, le=2100)
    semester: str | None = Field(default=None, min_length=1, max_length=20)
    level: str | None = Field(default=None, min_length=1, max_length=30)
    topic_title: str | None = Field(default=None, min_length=1, max_length=250)
    category: str | None = Field(default=None, min_length=1, max_length=50)
    program: str | None = Field(default=None, min_length=1, max_length=120)
    committee_id: int | None = None
    supervisor_id: int | None = None
    reviewer_id: int | None = None


class StudentRead(StudentBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class StudentDetail(StudentRead):
    committee: CommitteeRead
    supervisor: TeacherRead | None = None
    reviewer: TeacherRead | None = None


class StudentSearchResponse(BaseModel):
    items: list[StudentRead]
    total: int
    limit: int
    offset: int

