from sqlalchemy import and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.models.note import Note
from app.db.models.user import User
from app.schemas.note import NoteCreate
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException, status


async def get_notes_for_user(db: AsyncSession, user: User):
    result = await db.execute(
        select(Note).where(
            and_(
                Note.author_id == user.id,
                Note.is_active,
                Note.date_replaced.is_(None)
            )
        )
    )
    notes = result.scalars().all()
    return notes


async def create_note(
    db: AsyncSession,
    note_data: NoteCreate,
    current_user: User
) -> Note:
    try:
        new_note = Note(
            title=note_data.title,
            content=note_data.content,
            author_id=current_user.id,
        )
        db.add(new_note)
        await db.commit()
        await db.refresh(new_note)
        return new_note
    except SQLAlchemyError as e:
        print("error", e)
        await db.rollback()  # Revertir los cambios en caso de error
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while creating the note."
        )
    except Exception as e:
        print("error", e)
        await db.rollback()  # Revertir los cambios en caso de error
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unexpected error occurred."
        )
