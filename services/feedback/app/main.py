from datetime import datetime, timedelta, timezone
from secrets import token_urlsafe
from uuid import uuid4

from fastapi import Depends, FastAPI, Header, HTTPException, Query, status, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import shutil

from .config import Settings, get_settings
from .database import (
    delete_auth_token,
    delete_expired_auth_tokens,
    delete_feedback,
    ensure_database,
    get_auth_token,
    get_feedback,
    insert_auth_token,
    insert_feedback,
    list_feedback,
    update_feedback,
)
from .schemas import (
    ApiMessageResponse,
    AuthLoginData,
    AuthLoginRequest,
    AuthLoginResponse,
    AuthUser,
    FeedbackCreate,
    FeedbackListResponse,
    FeedbackRecord,
    FeedbackStatusUpdate,
    FeedbackSubmitResponse,
)


app = FastAPI(title="PS API", version="0.1.0")

ADMIN_PERMISSIONS = [
    "ticket:view",
    "ticket:edit",
    "ticket:delete",
    "product:view",
    "product:edit",
    "inventory:view",
    "inventory:edit",
    "survey:view",
    "survey:edit",
    "user:view",
    "user:edit",
    "config:view",
    "config:edit",
    "feedback:confirm",
]
USER_PERMISSIONS = [
    "ticket:view",
    "product:view",
    "inventory:view",
    "survey:view",
]
DEFAULT_USERS = {
    "admin": {
        "username": "admin",
        "real_name": "系统管理员",
        "roles": ["admin", "operator"],
        "permissions": ADMIN_PERMISSIONS,
    },
    "guest": {
        "username": "guest",
        "real_name": "Guest",
        "roles": ["guest"],
        "permissions": USER_PERMISSIONS,
    },
    "eric": {
        "username": "Eric",
        "real_name": "Eric",
        "roles": ["operator"],
        "permissions": USER_PERMISSIONS,
    },
    "irene": {
        "username": "Irene",
        "real_name": "Irene",
        "roles": ["operator"],
        "permissions": USER_PERMISSIONS,
    },
    "charles": {
        "username": "charles",
        "real_name": "charles",
        "roles": ["operator"],
        "permissions": USER_PERMISSIONS,
    },
    "maddie": {
        "username": "Maddie",
        "real_name": "Maddie",
        "roles": ["operator"],
        "permissions": USER_PERMISSIONS,
    },
    "gm": {
        "username": "gm",
        "real_name": "GM",
        "roles": ["operator"],
        "permissions": USER_PERMISSIONS,
    },
}

settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup() -> None:
    ensure_database(settings.sqlite_path)
    # Ensure uploads directory exists
    uploads_dir = os.path.join(os.path.dirname(settings.sqlite_path), "uploads")
    os.makedirs(uploads_dir, exist_ok=True)
    # Mount static files
    app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


def require_auth(
    authorization: str | None = Header(default=None),
    settings: Settings = Depends(get_settings),
) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing authorization token.")

    token = authorization.removeprefix("Bearer ").strip()
    record = get_auth_token(settings.sqlite_path, token)
    if not record:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authorization token.")

    now = datetime.now(timezone.utc)
    expires_at = datetime.fromisoformat(record["expires_at"])
    if expires_at <= now:
        delete_auth_token(settings.sqlite_path, token)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authorization token expired.")

    return record["username"]


def get_user_profile(username: str, settings: Settings) -> dict[str, object] | None:
    normalized_username = username.strip().lower()

    if normalized_username == settings.auth_username.strip().lower():
        return DEFAULT_USERS["admin"]

    return DEFAULT_USERS.get(normalized_username)


def is_admin_user(username: str, settings: Settings) -> bool:
    profile = get_user_profile(username, settings)
    if not profile:
        return False
    return "admin" in profile.get("roles", [])


def build_auth_user(username: str, settings: Settings) -> AuthUser:
    profile = get_user_profile(username, settings)
    if not profile:
        profile = DEFAULT_USERS["guest"]

    return AuthUser(
        userId=f"U-{str(profile['username']).lower()}",
        username=str(profile["username"]),
        realName=str(profile["real_name"]),
        roles=list(profile["roles"]),
        permissions=list(profile["permissions"]),
    )


@app.post("/api/auth/login", response_model=AuthLoginResponse)
def login(payload: AuthLoginRequest, settings: Settings = Depends(get_settings)) -> AuthLoginResponse:
    profile = get_user_profile(payload.username, settings)
    if not profile or payload.password != settings.auth_password:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="用户名或密码错误")

    username = str(profile["username"])
    now = datetime.now(timezone.utc)
    expires_in = settings.auth_remember_token_ttl_seconds if payload.remember else settings.auth_token_ttl_seconds
    expires_at = now + timedelta(seconds=expires_in)
    token = token_urlsafe(32)
    delete_expired_auth_tokens(settings.sqlite_path, now)
    insert_auth_token(settings.sqlite_path, token, username, expires_at, now)

    return AuthLoginResponse(
        code=200,
        message="登录成功",
        data=AuthLoginData(
            token=token,
            expiresIn=expires_in,
            user=build_auth_user(username, settings),
        ),
    )


@app.post("/api/auth/logout", response_model=ApiMessageResponse)
def logout(
    authorization: str | None = Header(default=None),
    settings: Settings = Depends(get_settings),
) -> ApiMessageResponse:
    if authorization and authorization.startswith("Bearer "):
        delete_auth_token(settings.sqlite_path, authorization.removeprefix("Bearer ").strip())
    return ApiMessageResponse(code=200, message="退出成功")


@app.get("/api/feedback", response_model=FeedbackListResponse)
def get_feedback_list(
    category: str | None = Query(default=None, min_length=1, max_length=180),
    username: str = Depends(require_auth),
    settings: Settings = Depends(get_settings),
) -> FeedbackListResponse:
    return FeedbackListResponse(items=list_feedback(settings.sqlite_path, category))


@app.get("/api/feedback/{feedback_id}", response_model=FeedbackRecord)
def get_feedback_detail(
    feedback_id: str,
    username: str = Depends(require_auth),
    settings: Settings = Depends(get_settings),
) -> FeedbackRecord:
    record = get_feedback(settings.sqlite_path, feedback_id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Feedback not found.")
    return record


@app.post("/api/feedback", response_model=FeedbackSubmitResponse)
def submit_feedback(
    payload: FeedbackCreate,
    username: str = Depends(require_auth),
    settings: Settings = Depends(get_settings),
) -> FeedbackSubmitResponse:
    created_at = datetime.now(timezone.utc)
    record = FeedbackRecord(
        id=uuid4().hex,
        title=payload.title,
        content=payload.content,
        author=username,
        source=payload.source,
        category=payload.category,
        status="unread",
        created_at=created_at,
        update_dt=created_at,
    )

    insert_feedback(settings.sqlite_path, record)
    return FeedbackSubmitResponse(ok=True, record=record)


@app.put("/api/feedback/{feedback_id}", response_model=FeedbackSubmitResponse)
def update_feedback_detail(
    feedback_id: str,
    payload: FeedbackCreate,
    username: str = Depends(require_auth),
    settings: Settings = Depends(get_settings),
) -> FeedbackSubmitResponse:
    current = get_feedback(settings.sqlite_path, feedback_id)
    if not current:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Feedback not found.")

    record = FeedbackRecord(
        id=feedback_id,
        title=payload.title,
        content=payload.content,
        author=username,
        source=payload.source,
        category=payload.category,
        status=current.status,
        created_at=current.created_at,
        update_dt=datetime.now(timezone.utc),
    )
    updated = update_feedback(settings.sqlite_path, feedback_id, record)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Feedback not found.")

    return FeedbackSubmitResponse(ok=True, record=updated)


@app.patch("/api/feedback/{feedback_id}/status", response_model=FeedbackSubmitResponse)
def confirm_feedback_status(
    feedback_id: str,
    payload: FeedbackStatusUpdate,
    username: str = Depends(require_auth),
    settings: Settings = Depends(get_settings),
) -> FeedbackSubmitResponse:
    if not is_admin_user(username, settings):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admin can confirm feedback status.")

    current = get_feedback(settings.sqlite_path, feedback_id)
    if not current:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Feedback not found.")

    record = FeedbackRecord(
        id=feedback_id,
        title=current.title,
        content=current.content,
        author=current.author,
        source=current.source,
        category=current.category,
        status=payload.status,
        created_at=current.created_at,
        update_dt=datetime.now(timezone.utc),
    )
    updated = update_feedback(settings.sqlite_path, feedback_id, record)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Feedback not found.")

    return FeedbackSubmitResponse(ok=True, record=updated)


@app.delete("/api/feedback/{feedback_id}", response_model=ApiMessageResponse)
def delete_feedback_detail(
    feedback_id: str,
    username: str = Depends(require_auth),
    settings: Settings = Depends(get_settings),
) -> ApiMessageResponse:
    current = get_feedback(settings.sqlite_path, feedback_id)
    if not current:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Feedback not found.")

    is_owner = (current.author or "").strip().lower() == username.strip().lower()
    if not is_admin_user(username, settings) and not is_owner:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admin or owner can delete feedback.")

    deleted = delete_feedback(settings.sqlite_path, feedback_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Feedback not found.")

    return ApiMessageResponse(code=200, message="删除成功")


@app.post("/api/upload")
async def upload_image(
    file: UploadFile = File(...),
    username: str = Depends(require_auth),
    settings: Settings = Depends(get_settings),
) -> dict[str, str]:
    uploads_dir = os.path.join(os.path.dirname(settings.sqlite_path), "uploads")
    os.makedirs(uploads_dir, exist_ok=True)

    file_ext = os.path.splitext(file.filename or "")[1]
    filename = f"{uuid4().hex}{file_ext}"
    file_path = os.path.join(uploads_dir, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"location": f"/uploads/{filename}"}
