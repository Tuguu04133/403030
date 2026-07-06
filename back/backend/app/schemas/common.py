from pydantic import BaseModel, Field


class PageParams(BaseModel):
    limit: int = Field(default=100, ge=1, le=500)
    offset: int = Field(default=0, ge=0)


class SearchRequest(BaseModel):
    key: str
    limit: int = Field(default=10, ge=1, le=500)
    offset: int = Field(default=0, ge=0)

