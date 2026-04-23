from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.core.database import get_db

router = APIRouter(tags=["Health"])


@router.get("/health", summary="Health check")
def health_check(db: Session = Depends(get_db)):
    """Service health check with database connectivity test."""
    try:
        db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception:
        db_status = "disconnected"

    return {
        "service": "notification_service",
        "status": "running",
        "database": db_status,
    }
