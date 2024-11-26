from __future__ import annotations
import uuid
from datetime import datetime
from sqlalchemy import ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.db.database import Base
from app.utils.date import utcnow


class Note(Base):
    __tablename__ = "notes"
    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True, index=True, default=uuid.uuid4
    )
    version: Mapped[int] = mapped_column(
        primary_key=True, default=1
    )
    created_at: Mapped[datetime] = mapped_column(server_default=utcnow())
    title: Mapped[str] = mapped_column(nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)

    author_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE")
    )
    updated_on: Mapped[datetime] = mapped_column(server_default=utcnow())
    date_replaced: Mapped[datetime] = mapped_column(nullable=True)
    is_active: Mapped[bool] = mapped_column(default=True)
