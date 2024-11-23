from typing import Any
from fastapi import HTTPException, status
from pydantic import PostgresDsn
from sqlalchemy import select
from sqlalchemy.ext.asyncio import (
    AsyncAttrs,
    async_sessionmaker,
    create_async_engine,
    AsyncSession,
)
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import DeclarativeBase

# Database URL with port included for connection to the PostgreSQL database
DATABASE_URL = "postgresql+asyncpg://user:password@localhost:5432/app-notes"

# Create an asynchronous engine with the provided DATABASE_URL
engine = create_async_engine(DATABASE_URL, echo=True)  # The 'echo=True' will log SQL queries

# Create an asynchronous session factory, which is used to create new sessions
SessionFactory = async_sessionmaker(engine, autoflush=False, expire_on_commit=False)

# Define the base class for the database models with asynchronous capabilities
class Base(AsyncAttrs, DeclarativeBase):
    # Define an asynchronous 'save' method to add an object to the session and commit it
    async def save(self, db: AsyncSession):
        """
        :param db: The asynchronous session to be used for committing the object
        :return: Returns the result of the commit operation
        """
        try:
            db.add(self)  # Adds the instance (self) to the session
            return await db.commit()  # Asynchronously commits the session to the database
        except SQLAlchemyError as ex:  # Catches any SQLAlchemy exceptions
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=repr(ex)
            ) from ex