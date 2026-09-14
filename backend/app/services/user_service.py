"""
All auth business logic lives here. Routes (api/routes/users.py) stay thin
and just call these functions - keeps HTTP concerns separate from what
actually happens with the database and tokens.
"""

from datetime import datetime, timezone

from fastapi import HTTPException, status
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token as google_id_token
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.config import settings
from app.core.security import create_access_token, hash_password, verify_password
from app.database.collections import users_collection
from app.schemas.user import GoogleAuthRequest, LoginRequest, SignupRequest, TokenResponse, UserOut


def _doc_to_user_out(doc: dict) -> UserOut:
    return UserOut(
        id=str(doc["_id"]),
        email=doc["email"],
        full_name=doc["full_name"],
        auth_provider=doc["auth_provider"],
        created_at=doc["created_at"],
    )


async def signup_local(db: AsyncIOMotorDatabase, data: SignupRequest) -> TokenResponse:
    existing = await users_collection().find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="An account with this email already exists")

    doc = {
        "email": data.email,
        "full_name": data.full_name,
        "auth_provider": "local",
        "hashed_password": hash_password(data.password),
        "google_id": None,
        "created_at": datetime.now(timezone.utc),
    }
    result = await users_collection().insert_one(doc)
    doc["_id"] = result.inserted_id

    token = create_access_token(subject=str(doc["_id"]))
    return TokenResponse(access_token=token, user=_doc_to_user_out(doc))


async def login_local(db: AsyncIOMotorDatabase, data: LoginRequest) -> TokenResponse:
    doc = await users_collection().find_one({"email": data.email})
    if not doc or doc.get("auth_provider") != "local" or not doc.get("hashed_password"):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    if not verify_password(data.password, doc["hashed_password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    token = create_access_token(subject=str(doc["_id"]))
    return TokenResponse(access_token=token, user=_doc_to_user_out(doc))


async def login_or_signup_google(db: AsyncIOMotorDatabase, data: GoogleAuthRequest) -> TokenResponse:
    if not settings.google_client_id:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Google sign-in is not configured on the server (GOOGLE_CLIENT_ID missing)",
        )

    try:
        payload = google_id_token.verify_oauth2_token(
            data.id_token, google_requests.Request(), settings.google_client_id
        )
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Google token")

    google_id = payload["sub"]
    email = payload.get("email")
    full_name = payload.get("name", email)

    doc = await users_collection().find_one({"google_id": google_id})

    if not doc:
        # If they previously signed up with email/password using the same
        # address, link the Google login to that existing account instead
        # of creating a duplicate.
        doc = await users_collection().find_one({"email": email})
        if doc:
            await users_collection().update_one({"_id": doc["_id"]}, {"$set": {"google_id": google_id}})
            doc["google_id"] = google_id
        else:
            new_doc = {
                "email": email,
                "full_name": full_name,
                "auth_provider": "google",
                "hashed_password": None,
                "google_id": google_id,
                "created_at": datetime.now(timezone.utc),
            }
            result = await users_collection().insert_one(new_doc)
            new_doc["_id"] = result.inserted_id
            doc = new_doc

    token = create_access_token(subject=str(doc["_id"]))
    return TokenResponse(access_token=token, user=_doc_to_user_out(doc))


async def get_user_by_id(db: AsyncIOMotorDatabase, user_id: str) -> UserOut:
    from bson import ObjectId
    from bson.errors import InvalidId

    try:
        object_id = ObjectId(user_id)
    except InvalidId:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid user")

    doc = await users_collection().find_one({"_id": object_id})
    if not doc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    return _doc_to_user_out(doc)
