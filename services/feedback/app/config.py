from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    sqlite_path: str = Field(default="data/feedback.sqlite3", alias="SQLITE_PATH")
    allowed_origins: str = Field(
        default="http://localhost:5173,http://127.0.0.1:5173",
        alias="ALLOWED_ORIGINS",
    )
    auth_username: str = Field(default="admin", alias="AUTH_USERNAME")
    auth_password: str = Field(default="123456", alias="AUTH_PASSWORD")
    auth_token_ttl_seconds: int = Field(default=24 * 60 * 60, alias="AUTH_TOKEN_TTL_SECONDS")
    auth_remember_token_ttl_seconds: int = Field(
        default=15 * 24 * 60 * 60,
        alias="AUTH_REMEMBER_TOKEN_TTL_SECONDS",
    )

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @property
    def origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.allowed_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
