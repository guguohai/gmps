from fastapi import APIRouter, Depends
from app.schemas.miniapp import MiniAppPushRequest, MiniAppPushResponse
from app.tasks.miniapp import push_to_miniapp_task

router = APIRouter(prefix="/miniapp", tags=["Mini-Program Notification"])

@router.post("/push", response_model=MiniAppPushResponse)
async def push_notification(request: MiniAppPushRequest):
    """
    Trigger a push notification to the external Mini-Program client.
    """
    # Enqueue celery task
    push_to_miniapp_task.delay(
        message_id=request.message_id,
        event_code=request.event_code,
        event_name=request.event_name,
        ticket_no=request.ticket_no,
        event_time=request.event_time,
        summary=request.summary,
        ext=request.ext
    )
    
    return MiniAppPushResponse(
        code=200,
        message="success",
        data={"result": "SUCCESS"}
    )
