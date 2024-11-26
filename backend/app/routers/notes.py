from fastapi import APIRouter, Depends, HTTPException, status
from app.db.models.user import User
from app.core.dependencies import get_db
from app.services.note_service import get_notes_for_user, create_note
from app.core.jwt import get_current_user
from app.schemas.note import NoteResponse, NoteCreate
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()


@router.get("", response_model=list[NoteResponse])
async def get_notes(db: AsyncSession = Depends(get_db), current_user: User
                    = Depends(get_current_user)):
    # Called the service to get the notes
    notes = await get_notes_for_user(db, current_user)
    if not notes:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="No notes found.")
    return notes


@router.post("", response_model=NoteResponse,
             status_code=status.HTTP_201_CREATED)
async def add_note(
    note: NoteCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await create_note(db, note, current_user)
