"""
Owns three things:
1. Loading/saving chat history in MongoDB, keyed by sessionId.
2. Deciding whether this message belongs to the onboarding flow (manufacturer,
   not yet onboarded) or normal Q&A, and calling the right orchestrator path.
3. Persisting onboarding progress (profile_updates, onboarding_complete) back
   onto the user's account so they never have to repeat themselves.
"""

import uuid
from datetime import datetime, timezone

from motor.motor_asyncio import AsyncIOMotorDatabase

from ai_engine.agents.orchestrator import handle_message, handle_onboarding_message
from app.database.collections import chat_sessions_collection
from app.schemas.chat import ChatRequest, ChatResponse
from app.schemas.user import UserOut
from app.services.user_service import apply_onboarding_update


async def process_chat_message(
    db: AsyncIOMotorDatabase, request: ChatRequest, current_user: UserOut
) -> ChatResponse:
    session_id = request.sessionId or str(uuid.uuid4())

    session_doc = await chat_sessions_collection().find_one({"session_id": session_id})
    history = session_doc["history"] if session_doc else []

    is_onboarding = current_user.user_type == "manufacturer" and not current_user.onboarding_complete

    if is_onboarding:
        result = await handle_onboarding_message(
            message=request.message,
            known_fields=current_user.manufacturer_profile,
            history=history,
        )
        await apply_onboarding_update(
            db,
            current_user.id,
            result["profile_updates"],
            result["onboarding_complete"],
        )
        reply_text = result["reply"]
        sources = []
    else:
        result = await handle_message(
            message=request.message,
            user_type=current_user.user_type or "consumer",
            history=history,
            manufacturer_profile=current_user.manufacturer_profile,
        )
        reply_text = result["reply"]
        sources = result["sources"]

    updated_history = history + [
        {"role": "user", "text": request.message},
        {"role": "model", "text": reply_text},
    ]

    await chat_sessions_collection().update_one(
        {"session_id": session_id},
        {
            "$set": {
                "session_id": session_id,
                "user_id": current_user.id,
                "history": updated_history,
                "updated_at": datetime.now(timezone.utc),
            },
            "$setOnInsert": {"created_at": datetime.now(timezone.utc)},
        },
        upsert=True,
    )

    return ChatResponse(reply=reply_text, sources=sources, sessionId=session_id)
