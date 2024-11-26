from pydantic import BaseModel
from uuid import UUID


class NoteResponse(BaseModel):
    id: UUID
    title: str
    content: str


class NoteCreate(BaseModel):
    title: str
    content: str
