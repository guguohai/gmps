from pydantic import BaseModel, Field
from typing import Optional, Dict, Any

class MiniAppPushRequest(BaseModel):
    message_id: str = Field(..., description="Message unique identifier")
    event_code: str = Field(..., description="Unified event code")
    event_name: str = Field(..., description="Event name")
    ticket_no: str = Field(..., description="Ticket number")
    event_time: str = Field(..., description="Event time in ISO 8601 format")
    summary: Optional[str] = Field(None, description="Short summary for the notification")
    ext: Optional[Dict[str, Any]] = Field(None, description="Extended data")

class MiniAppPushResponse(BaseModel):
    code: int = Field(200, description="Response code")
    message: str = Field("success", description="Response message")
    data: Dict[str, str] = Field(default_factory=lambda: {"result": "SUCCESS"})
