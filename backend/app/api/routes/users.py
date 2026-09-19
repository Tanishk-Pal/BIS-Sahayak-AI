from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.api.dependencies import get_current_user, get_db
from app.schemas.user import (
    GoogleAuthRequest,
    LoginRequest,
    SignupRequest,
    TokenResponse,
    UserOut,
    UserTypeRequest,
)
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
    """Log in (or auto-create an account) using a Google ID token."""
    return await user_service.login_or_signup_google(db, data)


@router.get("/me", response_model=UserOut)
async def me(current_user: UserOut = Depends(get_current_user)):
    """Returns the logged-in user, including onboarding state. Frontend
    calls this on app load and after set-user-type to know whether to show
    the Consumer/Manufacturer picker, the onboarding chat, or normal chat."""
    return current_user


@router.post("/user-type", response_model=UserOut)
async def set_user_type(
    data: UserTypeRequest,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: UserOut = Depends(get_current_user),
):
    """Called once from the 'Who are you?' screen right after login."""
    return await user_service.set_user_type(db, current_user.id, data.user_type)
