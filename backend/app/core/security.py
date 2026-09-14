"""
Two jobs only:
1. Hash/verify passwords (for email+password signup/login)
2. Create/decode JWT access tokens (for staying logged in after either
   email or Google login)

Nothing else in the app should touch passlib or jose directly - route
everything through these functions so there's one place to change if the
hashing algorithm or token format ever needs to change.
"""

from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain_password: str) -> str:
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(subject: str, extra_claims: dict | None = None) -> str:
    """subject is the user's id (as a string) - goes into the JWT 'sub' claim."""
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.jwt_expire_minutes)
    payload = {"sub": subject, "exp": expire}
    if extra_claims:
        payload.update(extra_claims)
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> dict:
    """Raises jose.JWTError if the token is invalid or expired.
    Callers (see api/dependencies.py) catch this and turn it into a 401."""
    return jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])


__all__ = ["hash_password", "verify_password", "create_access_token", "decode_access_token", "JWTError"]
