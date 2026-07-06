from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.schemas.teacher import TeacherRead


class CommitteeBase(BaseModel):
    period_year: int = Field(ge=2000, le=2100)
    period_sem: str = Field(min_length=1, max_length=20)
    committee_no: int = Field(ge=1)
    name: str = Field(min_length=1, max_length=160)


class CommitteeCreate(CommitteeBase):
    pass


class CommitteeUpdate(BaseModel):
    period_year: int | None = Field(default=None, ge=2000, le=2100)
    period_sem: str | None = Field(default=None, min_length=1, max_length=20)
    committee_no: int | None = Field(default=None, ge=1)
    name: str | None = Field(default=None, min_length=1, max_length=160)


class CommitteeRead(CommitteeBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class CommitteeMemberBase(BaseModel):
    committee_id: int
    teacher_id: int | None = None
    is_external: bool = False
    external_name: str | None = Field(default=None, max_length=120)

    @model_validator(mode="after")
    def validate_member_identity(self) -> "CommitteeMemberBase":
        if self.is_external and not self.external_name:
            raise ValueError("external_name is required for external members")
        if not self.is_external and self.teacher_id is None:
            raise ValueError("teacher_id is required for internal members")
        return self


class CommitteeMemberCreate(CommitteeMemberBase):
    pass


class CommitteeMemberUpdate(BaseModel):
    teacher_id: int | None = None
    is_external: bool | None = None
    external_name: str | None = Field(default=None, max_length=120)


class CommitteeMemberRead(CommitteeMemberBase):
    id: int
    teacher: TeacherRead | None = None

    model_config = ConfigDict(from_attributes=True)


class CommitteeDetail(CommitteeRead):
    members: list[CommitteeMemberRead] = Field(default_factory=list)
