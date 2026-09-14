"""
What the API actually accepts and returns. Kept separate from models/user.py
on purpose: these are the public contract with the frontend and must never
expose hashed_password.
"""

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field


class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, description="At least 8 characters")
    full_name: str = Field(min_length=1)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class GoogleAuthRequest(BaseModel):
    id_token: str  # the credential returned by Google Identity Services on the frontend


class UserOut(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    auth_provider: Literal["local", "google"]
    created_at: datetime


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut
