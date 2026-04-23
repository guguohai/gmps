from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

FeedbackStatus = Literal["modified", "followed", "unread"]


class AuthLoginRequest(BaseModel):
    username: str = Field(min_length=1, max_length=80)
    password: str = Field(min_length=1, max_length=120)
    remember: bool = False


class AuthUser(BaseModel):
    userId: str
    username: str
    realName: str
    roles: list[str]
    permissions: list[str]


class AuthLoginData(BaseModel):
    token: str
    expiresIn: int
    user: AuthUser


class AuthLoginResponse(BaseModel):
    code: int
    message: str
    data: AuthLoginData


class ApiMessageResponse(BaseModel):
    code: int
    message: str


class FeedbackStatusUpdate(BaseModel):
    status: FeedbackStatus


class FeedbackCreate(BaseModel):
    title: str = Field(min_length=1, max_length=120)
    content: str = Field(min_length=1, max_length=10000)
    author: str | None = Field(default=None, max_length=80)
    source: str | None = Field(default="ps-v3", max_length=80)
    category: str = Field(default="global", min_length=1, max_length=180)
    status: FeedbackStatus = "unread"


class FeedbackRecord(FeedbackCreate):
    id: str
    created_at: datetime
    update_dt: datetime


class FeedbackSubmitResponse(BaseModel):
    ok: bool
    record: FeedbackRecord


class FeedbackListResponse(BaseModel):
    items: list[FeedbackRecord]
