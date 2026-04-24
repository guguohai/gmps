import json

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Optional

from app.core.database import get_db
from app.core.security import verify_token
from app.schemas.notification import (
    NotificationSendRequest,
    NotificationSendResponse,
    NotificationTemplateOut,
    NotificationLogOut,
)
from app.tasks.miniapp import push_to_miniapp_task

router = APIRouter(prefix="/notifications", tags=["Notifications"])


def render_template(value: str, variables: dict | None) -> str:
    rendered = value or ""
    if not variables:
        return rendered

    for key, raw_value in variables.items():
        text_value = str(raw_value)
        rendered = rendered.replace(f"{{{{{key}}}}}", text_value)
        rendered = rendered.replace(f"{{{key}}}", text_value)
        rendered = rendered.replace(f"${{{key}}}", text_value)
    return rendered


def dispatch_notification(req: NotificationSendRequest, title: str, content: str) -> tuple[str, str | None]:
    if req.channel.value == "MINI_PROGRAM":
        ticket_no = req.biz_no or (req.variables or {}).get("ticket_no") or ""
        push_to_miniapp_task.delay(
            message_id=req.message_id,
            event_code=req.event_code or req.template_code,
            event_name=req.event_name or title or req.template_code,
            ticket_no=str(ticket_no),
            event_time=(req.event_time.isoformat() if req.event_time else ""),
            summary=content[:500] if content else None,
            ext=req.variables,
        )
        return "PENDING", None

    # Email/SMS/System adapters are intentionally thin until provider SDKs are configured.
    return "SUCCESS", None


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
    existing = db.execute(
        text("SELECT id, send_status FROM notification_send_log WHERE message_id = :message_id LIMIT 1"),
        {"message_id": req.message_id},
    ).mappings().first()

    if existing:
        return NotificationSendResponse(
            success=True,
            message=f"Notification already accepted with status {existing['send_status']}",
            send_log_id=existing["id"],
            duplicated=True,
        )

    template = db.execute(
        text("SELECT * FROM notification_template WHERE template_code = :code AND status = 'ENABLED' LIMIT 1"),
        {"code": req.template_code},
    ).mappings().first()

    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Template '{req.template_code}' not found or disabled",
        )

    content = render_template(template["template_content"] or "", req.variables)
    title = render_template(template["template_title"] or "", req.variables)
    send_status, fail_reason = dispatch_notification(req, title, content)

    result = db.execute(
        text("""
            INSERT INTO notification_send_log
                (ticket_id, template_id, message_id, event_code, event_name, biz_no,
                 channel_type, template_name, receiver, receiver_type, summary,
                 event_time, sent_at, send_status, retry_count, fail_reason,
                 request_payload, response_payload, created_at)
            VALUES
                (:ticket_id, :template_id, :message_id, :event_code, :event_name, :biz_no,
                 :channel_type, :template_name, :receiver, :receiver_type, :summary,
                 :event_time, CASE WHEN :send_status = 'SUCCESS' THEN NOW() ELSE NULL END,
                 :send_status, 0, :fail_reason, :request_payload, :response_payload, NOW())
        """),
        {
            "ticket_id": req.ticket_id,
            "template_id": template["id"],
            "message_id": req.message_id,
            "event_code": req.event_code,
            "event_name": req.event_name,
            "biz_no": req.biz_no,
            "channel_type": req.channel.value,
            "template_name": template["template_name"],
            "receiver": req.receiver,
            "receiver_type": req.receiver_type,
            "summary": content[:500] if content else None,
            "event_time": req.event_time,
            "send_status": send_status,
            "fail_reason": fail_reason,
            "request_payload": json.dumps(req.model_dump(mode="json"), ensure_ascii=False),
            "response_payload": json.dumps({"title": title, "content": content}, ensure_ascii=False),
        },
    )
    db.commit()

    return NotificationSendResponse(
        success=True,
        message=f"Notification accepted via {req.channel.value}",
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
        query += " AND channel_type = :channel"
        params["channel"] = channel

    query += " ORDER BY id DESC LIMIT :limit OFFSET :offset"
    params["limit"] = limit
    params["offset"] = offset

    rows = db.execute(text(query), params).mappings().all()
    return [NotificationLogOut(**dict(r)) for r in rows]
