from datetime import datetime
from pydantic import BaseModel
from uuid import UUID
from typing import Optional


class NoteResponse(BaseModel):
    id: UUID
    title: str
    content: str
    version: int


class NoteCreate(BaseModel):
    title: str
    content: str


class NoteUpdate(BaseModel):
    title: Optional[str]
    content: Optional[str]
    updated_on: datetime
