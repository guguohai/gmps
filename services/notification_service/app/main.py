from fastapi import FastAPI
from app.core.config import get_settings
from app.api.health import router as health_router
from app.api.notification import router as notification_router
from app.api.miniapp import router as miniapp_router

settings = get_settings()

app = FastAPI(
    title="PS Notification Service",
    description="Microservice for sending notifications (Email, SMS, WeChat, System) and managing templates.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Register routers
app.include_router(health_router)
app.include_router(notification_router, prefix="/api/v1")
app.include_router(miniapp_router, prefix="/api/v1")
