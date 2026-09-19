"""
Thin wrapper around the Gemini API. Nothing else in the app should import
google.generativeai directly - route every LLM call through here, so if the
model, SDK, or provider ever changes, this is the only file that changes.
"""

import json
import logging

import google.generativeai as genai

from app.core.config import settings

logger = logging.getLogger(__name__)

_model = None
_json_model = None


def _ensure_configured():
    if not settings.gemini_api_key:
        raise RuntimeError(
            "GEMINI_API_KEY is not set in .env - get one from https://aistudio.google.com/apikey"
        )
    genai.configure(api_key=settings.gemini_api_key)


def _get_model():
    global _model
    if _model is None:
        _ensure_configured()
        _model = genai.GenerativeModel(settings.gemini_model)
    return _model


def _get_json_model():
    """Same model, but configured to always return valid JSON - used for the
    onboarding flow, where we need structured fields extracted from the
    conversation, not just a plain text reply."""
    global _json_model
    if _json_model is None:
        _ensure_configured()
        _json_model = genai.GenerativeModel(
            settings.gemini_model,
            generation_config={"response_mime_type": "application/json"},
        )
    return _json_model


async def generate_reply(system_prompt: str, user_message: str, history: list[dict] | None = None) -> str:
    """
    history: optional list of {"role": "user" | "model", "text": str} from
    earlier turns in the same chat session, oldest first. Pass None or []
    for a fresh conversation.
    """
    model = _get_model()

    chat_history = [{"role": turn["role"], "parts": [turn["text"]]} for turn in (history or [])]
    chat = model.start_chat(history=chat_history)

    full_prompt = f"{system_prompt}\n\nUser: {user_message}"
    response = await chat.send_message_async(full_prompt)
    return response.text


async def generate_structured_reply(
    system_prompt: str, user_message: str, history: list[dict] | None = None
) -> dict:
    """
    Same idea as generate_reply, but the model is instructed (via
    system_prompt) to respond with a single JSON object, and this parses it
    before returning. Used by the onboarding flow - see
    ai_engine/agents/orchestrator.py::handle_onboarding_message and
    ai_engine/llm/prompts.py::MANUFACTURER_ONBOARDING_PROMPT for the exact
    JSON shape expected.

    Falls back to a safe default shape if Gemini ever returns malformed
    JSON, rather than letting the whole request 500.
    """
    model = _get_json_model()

    chat_history = [{"role": turn["role"], "parts": [turn["text"]]} for turn in (history or [])]
    chat = model.start_chat(history=chat_history)

    full_prompt = f"{system_prompt}\n\nUser: {user_message}"
    response = await chat.send_message_async(full_prompt)

    try:
        return json.loads(response.text)
    except (json.JSONDecodeError, TypeError):
        logger.warning("Gemini returned non-JSON in structured mode: %r", response.text)
        return {
            "reply": response.text if isinstance(response.text, str) else "Could you tell me more about your product?",
            "profile_updates": {},
            "onboarding_complete": False,
        }
