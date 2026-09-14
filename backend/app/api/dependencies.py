"""
Shared dependencies used across routes.

get_db          -> injects the MongoDB database
get_current_user -> reads the JWT from the Authorization header, validates
                     it, and returns the logged-in user. Add this to any
                     route that should require login, e.g.:

                     @router.get("/me")
                     async def me(user: UserOut = Depends(get_current_user)):
                         return user
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.security import decode_access_token
from app.database.connection import get_database
from app.schemas.user import UserOut
from app.services.user_service import get_user_by_id

# tokenUrl just points Swagger UI's "Authorize" button at /api/login -
# it doesn't change how the token itself is validated.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")


def get_db() -> AsyncIOMotorDatabase:
    return get_database()


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncIOMotorDatabase = Depends(get_db),
) -> UserOut:
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = decode_access_token(token)
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_error
    except JWTError:
        raise credentials_error

    return await get_user_by_id(db, user_id)
