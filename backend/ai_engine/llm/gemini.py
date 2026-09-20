"""
Thin wrapper around the Gemini API.

All Gemini calls should go through this file so the rest of the
application does not need to know which Gemini SDK is being used.

This version uses the Google GenAI SDK and safely handles Gemini
quota/rate-limit errors without turning them into a backend 500.
"""

import json
import logging

from google import genai
from google.genai import types
from google.genai.errors import ClientError

from app.core.config import settings

logger = logging.getLogger(__name__)

_client = None


# =========================================================
# USER-FRIENDLY ERROR MESSAGES
# =========================================================

QUOTA_ERROR_MESSAGE = (
    "BIS Sahayak AI is temporarily unable to generate an AI response "
    "because the Gemini API request limit has been reached. "
    "Please try again later."
)

GENERAL_GEMINI_ERROR_MESSAGE = (
    "BIS Sahayak AI is temporarily unable to generate a response. "
    "Please try again in a moment."
)


# =========================================================
# GEMINI CLIENT
# =========================================================

def _ensure_configured():
    """Create the Gemini client once."""

    global _client

    if not settings.gemini_api_key:
        raise RuntimeError(
            "GEMINI_API_KEY is not set in .env. "
            "Get a key from Google AI Studio."
        )

    if _client is None:
        _client = genai.Client(
            api_key=settings.gemini_api_key
        )

    return _client


def _get_model_name() -> str:
    """Return the Gemini model configured in .env."""

    model_name = getattr(settings, "gemini_model", None)

    if not model_name:
        raise RuntimeError(
            "GEMINI_MODEL is not configured in .env."
        )

    return model_name


# =========================================================
# CONTENT BUILDER
# =========================================================

def _build_contents(
    system_prompt: str,
    user_message: str,
    history: list[dict] | None = None,
):
    """
    Convert the application's history format into the format
    accepted by the Google GenAI SDK.

    Expected history format:

    [
        {
            "role": "user",
            "text": "Hello"
        },
        {
            "role": "model",
            "text": "Hello! How can I help?"
        }
    ]
    """

    contents = []

    for turn in history or []:
        role = turn.get("role")
        text = turn.get("text", "")

        if role not in ("user", "model"):
            continue

        if not text:
            continue

        contents.append(
            types.Content(
                role=role,
                parts=[
                    types.Part.from_text(text=text)
                ],
            )
        )

    # Keep the existing application's behavior:
    # system prompt + current user message.
    full_prompt = f"{system_prompt}\n\nUser: {user_message}"

    contents.append(
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text=full_prompt)
            ],
        )
    )

    return contents


# =========================================================
# ERROR HANDLING
# =========================================================

def _is_quota_error(error: ClientError) -> bool:
    """
    Check whether Gemini returned a 429 quota/rate-limit error.
    """

    return getattr(error, "code", None) == 429


def _handle_gemini_error(error: ClientError) -> str:
    """
    Convert Gemini API errors into safe user-facing messages.

    Important:
    We do NOT expose the raw Gemini error, API key information,
    project information, or internal traceback to the frontend.
    """

    if _is_quota_error(error):
        logger.warning(
            "Gemini quota/rate limit reached: %s",
            error,
        )

        return QUOTA_ERROR_MESSAGE

    logger.error(
        "Gemini API error: %s",
        error,
        exc_info=True,
    )

    return GENERAL_GEMINI_ERROR_MESSAGE


# =========================================================
# NORMAL CHAT REPLY
# =========================================================

async def generate_reply(
    system_prompt: str,
    user_message: str,
    history: list[dict] | None = None,
) -> str:
    """
    Generate a normal text response.

    Returns a friendly message instead of allowing a Gemini
    quota error to crash the FastAPI request.
    """

    try:
        client = _ensure_configured()
        model_name = _get_model_name()

        contents = _build_contents(
            system_prompt=system_prompt,
            user_message=user_message,
            history=history,
        )

        response = await client.aio.models.generate_content(
            model=model_name,
            contents=contents,
        )

        # Gemini normally returns response.text.
        if response and response.text:
            return response.text

        logger.warning(
            "Gemini returned an empty response."
        )

        return GENERAL_GEMINI_ERROR_MESSAGE

    except ClientError as error:
        return _handle_gemini_error(error)

    except Exception as error:
        logger.error(
            "Unexpected Gemini error: %s",
            error,
            exc_info=True,
        )

        return GENERAL_GEMINI_ERROR_MESSAGE


# =========================================================
# STRUCTURED / JSON REPLY
# =========================================================

async def generate_structured_reply(
    system_prompt: str,
    user_message: str,
    history: list[dict] | None = None,
) -> dict:
    """
    Generate a structured JSON response.

    Used by the onboarding flow.

    If Gemini reaches its quota or returns malformed JSON,
    return a safe default structure instead of crashing
    the backend request.
    """

    try:
        client = _ensure_configured()
        model_name = _get_model_name()

        contents = _build_contents(
            system_prompt=system_prompt,
            user_message=user_message,
            history=history,
        )

        config = types.GenerateContentConfig(
            response_mime_type="application/json"
        )

        response = await client.aio.models.generate_content(
            model=model_name,
            contents=contents,
            config=config,
        )

        if not response or not response.text:
            logger.warning(
                "Gemini returned an empty structured response."
            )

            return {
                "reply": GENERAL_GEMINI_ERROR_MESSAGE,
                "profile_updates": {},
                "onboarding_complete": False,
            }

        try:
            return json.loads(response.text)

        except (json.JSONDecodeError, TypeError):
            logger.warning(
                "Gemini returned non-JSON in structured mode: %r",
                response.text,
            )

            return {
                "reply": response.text,
                "profile_updates": {},
                "onboarding_complete": False,
            }

    except ClientError as error:

        if _is_quota_error(error):
            logger.warning(
                "Gemini quota/rate limit reached during structured response: %s",
                error,
            )

            return {
                "reply": QUOTA_ERROR_MESSAGE,
                "profile_updates": {},
                "onboarding_complete": False,
            }

        logger.error(
            "Gemini structured API error: %s",
            error,
            exc_info=True,
        )

        return {
            "reply": GENERAL_GEMINI_ERROR_MESSAGE,
            "profile_updates": {},
            "onboarding_complete": False,
        }

    except Exception as error:
        logger.error(
            "Unexpected Gemini structured error: %s",
            error,
            exc_info=True,
        )

        return {
            "reply": GENERAL_GEMINI_ERROR_MESSAGE,
            "profile_updates": {},
            "onboarding_complete": False,
        }