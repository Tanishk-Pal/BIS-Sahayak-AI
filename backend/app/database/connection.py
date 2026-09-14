"""
One shared Motor client for the whole app's lifetime.
connect_to_mongo() runs on FastAPI startup, close_mongo_connection() on
shutdown (both wired up in main.py). Routes/services get the database via
the get_database() dependency in api/dependencies.py - never import
`db` directly from here.
"""

import logging

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.core.config import settings

logger = logging.getLogger(__name__)

client: AsyncIOMotorClient | None = None
db: AsyncIOMotorDatabase | None = None


async def connect_to_mongo() -> None:
    global client, db
    client = AsyncIOMotorClient(settings.mongodb_uri)
    db = client[settings.mongodb_db_name]
    # Fails fast at startup if MongoDB isn't reachable, instead of failing
    # silently on the first real request.
    await client.admin.command("ping")
    logger.info("Connected to MongoDB at %s / db '%s'", settings.mongodb_uri, settings.mongodb_db_name)


async def close_mongo_connection() -> None:
    global client
    if client is not None:
        client.close()
        logger.info("MongoDB connection closed")


def get_database() -> AsyncIOMotorDatabase:
    if db is None:
        raise RuntimeError("Database not initialized - connect_to_mongo() must run before this is called")
    return db
