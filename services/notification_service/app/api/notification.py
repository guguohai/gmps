from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Optional
from datetime import datetime

from app.core.database import get_db
from app.core.security import verify_token
from app.schemas.notification import (
    NotificationSendRequest,
    NotificationSendResponse,
    NotificationTemplateOut,
    NotificationLogOut,
)

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.post("/send", response_model=NotificationSendResponse, summary="Send a notification")
def send_notification(
    req: NotificationSendRequest,
    db: Session = Depends(get_db),
    token_payload: dict = Depends(verify_token),
):
    """
    Send a notification via the specified channel.
    Looks up the template, renders content, dispatches, and logs the result.
    """
    # 1. Look up template
    template = db.execute(
        text("SELECT * FROM notification_template WHERE template_code = :code AND status = 'ENABLED' LIMIT 1"),
        {"code": req.template_code},
    ).mappings().first()

    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Template '{req.template_code}' not found or disabled",
        )

    # 2. Render content (simple variable substitution)
    content = template["template_content"] or ""
    title = template["template_title"] or ""
    if req.variables:
        for key, value in req.variables.items():
            content = content.replace(f"{{{{{key}}}}}", str(value))
            title = title.replace(f"{{{{{key}}}}}", str(value))

    # 3. Dispatch (placeholder - integrate actual SMS/Email/WeChat SDK here)
    send_status = "SUCCESS"
    error_message = None

    # 4. Log the send result
    result = db.execute(
        text("""
            INSERT INTO notification_send_log
                (template_code, channel, recipient, send_status, ticket_id,
                 rendered_title, rendered_content, sent_at, error_message, created_at)
            VALUES
                (:template_code, :channel, :recipient, :send_status, :ticket_id,
                 :rendered_title, :rendered_content, NOW(), :error_message, NOW())
        """),
        {
            "template_code": req.template_code,
            "channel": req.channel.value,
            "recipient": req.recipient,
            "send_status": send_status,
            "ticket_id": req.ticket_id,
            "rendered_title": title,
            "rendered_content": content,
            "error_message": error_message,
        },
    )
    db.commit()

    return NotificationSendResponse(
        success=True,
        message=f"Notification sent via {req.channel.value}",
        send_log_id=result.lastrowid,
    )


@router.get("/templates", response_model=list[NotificationTemplateOut], summary="List notification templates")
def list_templates(
    template_type: Optional[str] = Query(None, description="Filter by template type"),
    status_filter: Optional[str] = Query("ENABLED", alias="status", description="Filter by status"),
    db: Session = Depends(get_db),
    token_payload: dict = Depends(verify_token),
):
    """List all notification templates with optional filters."""
    query = "SELECT * FROM notification_template WHERE 1=1"
    params = {}

    if template_type:
        query += " AND template_type = :template_type"
        params["template_type"] = template_type
    if status_filter:
        query += " AND status = :status"
        params["status"] = status_filter

    query += " ORDER BY id DESC"

    rows = db.execute(text(query), params).mappings().all()
    return [NotificationTemplateOut(**dict(r)) for r in rows]


@router.get("/logs", response_model=list[NotificationLogOut], summary="Query send logs")
def list_send_logs(
    ticket_id: Optional[int] = Query(None, description="Filter by ticket ID"),
    channel: Optional[str] = Query(None, description="Filter by channel"),
    limit: int = Query(20, ge=1, le=100, description="Page size"),
    offset: int = Query(0, ge=0, description="Offset"),
    db: Session = Depends(get_db),
    token_payload: dict = Depends(verify_token),
):
    """Query notification send logs with optional filters."""
    query = "SELECT * FROM notification_send_log WHERE 1=1"
    params = {}

    if ticket_id:
        query += " AND ticket_id = :ticket_id"
        params["ticket_id"] = ticket_id
    if channel:
        query += " AND channel = :channel"
        params["channel"] = channel

    query += " ORDER BY id DESC LIMIT :limit OFFSET :offset"
    params["limit"] = limit
    params["offset"] = offset

    rows = db.execute(text(query), params).mappings().all()
    return [NotificationLogOut(**dict(r)) for r in rows]
