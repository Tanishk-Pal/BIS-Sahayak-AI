from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.api.dependencies import get_current_user, get_db
from app.schemas.user import GoogleAuthRequest, LoginRequest, SignupRequest, TokenResponse, UserOut
from app.services import user_service

router = APIRouter(prefix="/api", tags=["auth"])


@router.post("/signup", response_model=TokenResponse)
async def signup(data: SignupRequest, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Create an account with email + password. Returns a JWT immediately
    so the user is logged in right after signing up."""
    return await user_service.signup_local(db, data)


@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Log in with email + password."""
    return await user_service.login_local(db, data)


@router.post("/auth/google", response_model=TokenResponse)
async def auth_google(data: GoogleAuthRequest, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Log in (or auto-create an account) using a Google ID token.
    The frontend gets this token from Google Identity Services after the
    user picks their Google account - see frontend/src/services/authService.js."""
    return await user_service.login_or_signup_google(db, data)


@router.get("/me", response_model=UserOut)
async def me(current_user: UserOut = Depends(get_current_user)):
    """Returns the logged-in user. Frontend calls this on app load to check
    if a saved token is still valid and to restore the session."""
    return current_user
