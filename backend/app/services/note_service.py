from datetime import datetime
from uuid import UUID
from sqlalchemy import and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.models.note import Note
from app.db.models.user import User
from app.schemas.note import (
    NoteCreate,
    NoteUpdate,
    NoteUpdateResponse
)
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
  

async def update_note(
    db: AsyncSession, id: UUID, note_data: NoteUpdate
) -> NoteUpdateResponse:
    # Find the latest version of the note.
    note = await get_note(db, id)

    if not note:
        return {"success": False,
                "message": f"Note with id {id} not found"}

    # Validate the note
    if note.version != note_data.version:
        return {
            "success": False,
            "message": "The note has been modified by another process",
            "current_note": note,
        }

    await next_version(db, note, note_data)

    return NoteUpdateResponse(
        success=True,
        message="Note updated successfully",
    )


async def next_version(db: AsyncSession,
                       note: Note,
                       note_data: NoteUpdate) -> Note:
    # Create a new version of the note
    new_note = Note(
        id=note.id,
        version=note.version + 1,
        author_id=note.author_id,
        title=note_data.title,
        content=note_data.content,
        is_active=True,
    )

    note.date_replaced = datetime.utcnow()
    db.add(new_note)
    db.add(note)

    print("new_note", new_note)
    await db.commit()
    await db.refresh(new_note)

    return new_note


async def get_note(
    db: AsyncSession, id: UUID
) -> Note | None:
    query = select(Note).where(
        Note.id == id,
        Note.is_active,
        Note.date_replaced.is_(None)
    )
    result = await db.execute(query)
    return result.scalars().first()


async def delete_note(
    db: AsyncSession, id: UUID
) -> Note | None:
    note = await get_note(db, id)

    if not note:
        return {"success": False,
                "message": f"Note with id {id} not found"}

    note.is_active = False
    db.add(note)
    await db.commit()
    await db.refresh(note)
    return note
