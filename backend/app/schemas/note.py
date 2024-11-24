from pydantic import BaseModel


class NoteResponse(BaseModel):
    title: str
    content: str
