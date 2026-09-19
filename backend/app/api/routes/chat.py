from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.api.dependencies import get_current_user, get_db
from app.schemas.chat import ChatRequest, ChatResponse
from app.schemas.user import UserOut
from app.services.chat_service import process_chat_message

router = APIRouter(prefix="/api", tags=["chat"])


@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: UserOut = Depends(get_current_user),
):
    try:
        return await process_chat_message(db, request, current_user)
    except RuntimeError as e:
        # Raised by ai_engine/llm/gemini.py if GEMINI_API_KEY isn't configured
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(e))
