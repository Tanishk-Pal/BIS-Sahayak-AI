"""
This describes the document shape stored in the `users` collection.
It's used internally (services/user_service.py) - the API never returns
this directly, it returns schemas.user.UserOut instead, so hashed_password
never leaks into an API response.
"""

from datetime import datetime, timezone
from typing import Any, Literal, Optional

from pydantic import BaseModel, EmailStr, Field


class UserInDB(BaseModel):
    id: str = Field(alias="_id")
    email: EmailStr
    full_name: str
    auth_provider: Literal["local", "google"]
    hashed_password: Optional[str] = None   # None for google-only accounts
    google_id: Optional[str] = None         # None for local (email/password) accounts
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    # Onboarding / product-profiling state
    user_type: Optional[Literal["consumer", "manufacturer"]] = None
    onboarding_complete: bool = False
    manufacturer_profile: dict[str, Any] = Field(default_factory=dict)

    model_config = {"populate_by_name": True}
