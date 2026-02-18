"""
Database Engine Configuration - Async SQLAlchemy
=================================================

Configures the async database engine, session factory, and declarative base.
Supports both SQLite (development) and PostgreSQL (production).

Created by: Divya Mohan (Software Architect)
"""

import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.pool import NullPool


DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite+aiosqlite:///./data/smartevaluator.db"
)

# Use NullPool for SQLite, QueuePool for PostgreSQL
if "sqlite" in DATABASE_URL:
    engine = create_async_engine(DATABASE_URL, echo=False, poolclass=NullPool)
else:
    engine = create_async_engine(
        DATABASE_URL,
        echo=False,
        pool_size=20,
        max_overflow=10,
        pool_pre_ping=True,
    )

async_session_factory = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    """Declarative base for all ORM models."""
    pass


async def get_db() -> AsyncSession:
    """
    FastAPI dependency that yields an async database session.
    Ensures the session is properly closed after each request.
    """
    async with async_session_factory() as session:
        try:
            yield session
        finally:
            await session.close()


async def init_db():
    """
    Initialize the database by creating all tables.
    Called on application startup.
    """
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
