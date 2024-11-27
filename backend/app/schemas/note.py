from typing import Any, Optional
from pydantic import BaseModel
from uuid import UUID


class NoteResponse(BaseModel):
    id: UUID
    title: str
    content: str
    version: int


class NoteCreate(BaseModel):
    title: str
    content: str


class NoteUpdate(BaseModel):
    title: str
    content: str
    version: int


class NoteUpdateResponse(BaseModel):
    success: bool
    message: str
    note: NoteResponse
