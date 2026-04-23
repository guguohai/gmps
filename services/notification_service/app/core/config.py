from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Service
    SERVICE_NAME: str = "notification_service"
    SERVICE_HOST: str = "0.0.0.0"
    SERVICE_PORT: int = 8001
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = "mysql://root:123456@127.0.0.1:3307/ps_admin"

    # JWT - shares secret with core_api for token validation
    JWT_SECRET_KEY: str = ""
    JWT_ALGORITHM: str = "HS256"

    # Celery
    CELERY_BROKER_URL: str = "redis://127.0.0.1:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://127.0.0.1:6379/0"

    # Mini Program Push Config
    MINIAPP_NOTIFY_URL: str = ""
    MINIAPP_NOTIFY_SECRET: str = ""

    class Config:
        env_file = "../../.env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
