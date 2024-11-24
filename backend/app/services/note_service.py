from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.models import Note, User


async def get_notes_for_user(db: AsyncSession, user: User):
    result = await db.execute(select(Note).filter(Note.author_id == user.id))
    notes = result.scalars().all()
    return notes
