from __future__ import annotations
import uuid
from datetime import datetime
from sqlalchemy import select, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import Base
from app.utils.date import utcnow

class Note(Base):
    __tablename__ = "notes"
    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True, index=True, default=uuid.uuid4
    )
    created_at: Mapped[datetime] = mapped_column(server_default=utcnow())
    title: Mapped[str]
    content: Mapped[str] = mapped_column(Text)

    author_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE")
    )
    updated_on: Mapped[datetime] = mapped_column(server_default=utcnow())
    author: Mapped["User"] = relationship("User", back_populates="notes")

    @classmethod
    async def find_by_author(cls, db: AsyncSession, author: User):
        query = select(cls).where(cls.author_id == author.id)
        result = await db.execute(query)
        return result.scalars().all()