"""
Named accessors for each MongoDB collection, so route/service code never
hardcodes a collection name string. If a collection ever gets renamed,
this is the only file that changes.
"""

from motor.motor_asyncio import AsyncIOMotorCollection

from app.database.connection import get_database


def users_collection() -> AsyncIOMotorCollection:
    return get_database()["users"]


def chat_sessions_collection() -> AsyncIOMotorCollection:
    return get_database()["chat_sessions"]


def compliance_assessments_collection() -> AsyncIOMotorCollection:
    return get_database()["compliance_assessments"]
