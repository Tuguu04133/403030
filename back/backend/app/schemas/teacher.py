from pydantic import BaseModel, ConfigDict, Field


class TeacherBase(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    gender: str = Field(min_length=1, max_length=10)
    expertise: str = Field(min_length=1, max_length=50)
    behavior: str = Field(min_length=1, max_length=30)
    bias: float = 0
    std: float = 0
    gpref: str | None = Field(default=None, max_length=10)
    gbonus: float = 0


class TeacherCreate(TeacherBase):
    pass


class TeacherUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=120)
    gender: str | None = Field(default=None, min_length=1, max_length=10)
    expertise: str | None = Field(default=None, min_length=1, max_length=50)
    behavior: str | None = Field(default=None, min_length=1, max_length=30)
    bias: float | None = None
    std: float | None = None
    gpref: str | None = Field(default=None, max_length=10)
    gbonus: float | None = None


class TeacherRead(TeacherBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class TeacherSearchResponse(BaseModel):
    items: list[TeacherRead]
    total: int
    limit: int
    offset: int

