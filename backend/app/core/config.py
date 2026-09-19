"""
Central place all environment config is read from.
Every other file that needs a setting imports `settings` from here -
never call os.getenv() directly elsewhere in the app.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # MongoDB
    mongodb_uri: str = "mongodb://localhost:27017"
    mongodb_db_name: str = "bis_sahayak_ai"

    # JWT
    jwt_secret: str = "dev-only-secret-change-me"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 1440

    # Google Sign-In
    google_client_id: str = ""

    # Gemini
    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.0-flash"

    # CORS - comma-separated in .env, parsed into a list here
    cors_origins: str = "http://localhost:5173"

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()
