from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum


class NotificationChannel(str, Enum):
    EMAIL = "EMAIL"
    SMS = "SMS"
    WECHAT = "WECHAT"
    SYSTEM = "SYSTEM"


class NotificationSendRequest(BaseModel):
    """Request schema for sending a notification."""
    template_code: str
    channel: NotificationChannel
    recipient: str
    ticket_id: Optional[int] = None
    variables: Optional[dict] = None
    lang_code: Optional[str] = "zh-CN"


class NotificationSendResponse(BaseModel):
    """Response schema after sending a notification."""
    success: bool
    message: str
    send_log_id: Optional[int] = None


class NotificationTemplateOut(BaseModel):
    """Response schema for notification template."""
    id: int
    template_code: str
    template_type: str
    template_name: str
    template_title: Optional[str] = None
    business_scene: Optional[str] = None
    trigger_node: Optional[str] = None
    lang_code: Optional[str] = None
    status: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class NotificationLogOut(BaseModel):
    """Response schema for notification send log."""
    id: int
    template_code: Optional[str] = None
    channel: Optional[str] = None
    recipient: Optional[str] = None
    send_status: Optional[str] = None
    ticket_id: Optional[int] = None
    sent_at: Optional[datetime] = None
    error_message: Optional[str] = None

    class Config:
        from_attributes = True
