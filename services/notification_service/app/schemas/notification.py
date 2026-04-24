from pydantic import AliasChoices, BaseModel, Field
from typing import Optional, Any
from datetime import datetime
from enum import Enum


class NotificationChannel(str, Enum):
    EMAIL = "EMAIL"
    SMS = "SMS"
    WECHAT = "WECHAT"
    MINI_PROGRAM = "MINI_PROGRAM"
    SYSTEM = "SYSTEM"


class NotificationSendRequest(BaseModel):
    """Request schema for sending a notification."""
    message_id: str
    template_code: str
    channel: NotificationChannel
    receiver: str = Field(..., validation_alias=AliasChoices("receiver", "recipient"))
    receiver_type: Optional[str] = "CUSTOMER"
    biz_type: Optional[str] = None
    biz_id: Optional[int] = None
    biz_no: Optional[str] = None
    event_code: Optional[str] = None
    event_name: Optional[str] = None
    event_time: Optional[datetime] = None
    ticket_id: Optional[int] = None
    variables: Optional[dict[str, Any]] = None
    lang_code: Optional[str] = "zh_CN"


class NotificationSendResponse(BaseModel):
    """Response schema after sending a notification."""
    success: bool
    message: str
    send_log_id: Optional[int] = None
    duplicated: bool = False


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
    message_id: Optional[str] = None
    event_code: Optional[str] = None
    event_name: Optional[str] = None
    biz_no: Optional[str] = None
    channel_type: Optional[str] = None
    receiver: Optional[str] = None
    receiver_type: Optional[str] = None
    summary: Optional[str] = None
    send_status: Optional[str] = None
    ticket_id: Optional[int] = None
    event_time: Optional[datetime] = None
    sent_at: Optional[datetime] = None
    retry_count: Optional[int] = None
    fail_reason: Optional[str] = None

    class Config:
        from_attributes = True
