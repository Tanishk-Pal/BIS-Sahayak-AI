"""
Entry point into the AI layer.

handle_message: normal Q&A (consumer, or manufacturer post-onboarding)
handle_onboarding_message: the guided product-profiling conversation that
runs for manufacturers until onboarding_complete is true

As consumer_agent.py, manufacturer_agent.py, standards_agent.py etc. get
built out (Phase 6+), this is where they get plugged in properly - for now
both paths call Gemini directly with a purpose-specific prompt.
"""

from ai_engine.llm.gemini import generate_reply, generate_structured_reply
from ai_engine.llm.prompts import get_onboarding_prompt, get_system_prompt


async def handle_message(
    message: str,
    user_type: str,
    history: list[dict] | None = None,
    manufacturer_profile: dict | None = None,
) -> dict:
    system_prompt = get_system_prompt(user_type, manufacturer_profile)
    reply_text = await generate_reply(system_prompt, message, history)

    return {
        "reply": reply_text,
        # No RAG yet, so no real sources to cite - empty for now rather than
        # inventing one. Populated once ai_engine/rag/pipeline.py exists.
        "sources": [],
    }


async def handle_onboarding_message(
    message: str,
    known_fields: dict,
    history: list[dict] | None = None,
) -> dict:
    """Returns {"reply": str, "profile_updates": dict, "onboarding_complete": bool}"""
    system_prompt = get_onboarding_prompt(known_fields)
    result = await generate_structured_reply(system_prompt, message, history)

    # Defensive defaults in case Gemini's JSON is missing a key
    return {
        "reply": result.get("reply", "Could you tell me a bit more about your product?"),
        "profile_updates": result.get("profile_updates", {}) or {},
        "onboarding_complete": bool(result.get("onboarding_complete", False)),
    }
