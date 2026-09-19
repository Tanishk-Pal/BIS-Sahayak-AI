from typing import Literal, Optional

from pydantic import BaseModel


class ChatSource(BaseModel):
    title: str
    url: Optional[str] = None
    section: Optional[str] = None


class ChatRequest(BaseModel):
    message: str
    userType: Literal["consumer", "manufacturer"] = "consumer"
    sessionId: Optional[str] = None


class ChatResponse(BaseModel):
    reply: str
    sources: list[ChatSource] = []
    sessionId: str
