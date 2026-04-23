import time
import uuid
import hashlib
import httpx
from datetime import datetime
from typing import Optional, Dict, Any
import logging

from app.core.celery_app import celery_app
from app.core.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

def generate_signature(ticket_no: str, timestamp: str, nonce: str, secret: str) -> str:
    """Generate SHA256 signature for miniapp push."""
    raw_str = f"{ticket_no}{timestamp}{nonce}{secret}"
    return hashlib.sha256(raw_str.encode("utf-8")).hexdigest()

@celery_app.task(
    bind=True,
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 3},
    retry_backoff=True
)
def push_to_miniapp_task(
    self,
    message_id: str,
    event_code: str,
    event_name: str,
    ticket_no: str,
    event_time: str,  # ISO 8601 string
    summary: Optional[str] = None,
    ext: Optional[Dict[str, Any]] = None
):
    """
    Push notification to Mini-program unified notification webhook.
    """
    if not settings.MINIAPP_NOTIFY_URL:
        logger.warning("MINIAPP_NOTIFY_URL is not configured. Skipping push.")
        return {"result": "SKIP", "reason": "No URL configured"}

    timestamp = str(int(time.time()))
    nonce = uuid.uuid4().hex
    
    sign = generate_signature(
        ticket_no=ticket_no,
        timestamp=timestamp,
        nonce=nonce,
        secret=settings.MINIAPP_NOTIFY_SECRET
    )
    
    payload = {
        "messageId": message_id,
        "eventCode": event_code,
        "eventName": event_name,
        "ticketNo": ticket_no,
        "summary": summary,
        "eventTime": event_time,
        "ext": ext,
        "timestamp": timestamp,
        "nonce": nonce,
        "sign": sign
    }
    
    logger.info(f"Pushing to miniapp: ticketNo={ticket_no}, eventCode={event_code}")
    
    try:
        # We can use httpx inside the worker
        with httpx.Client(timeout=10.0) as client:
            response = client.post(
                settings.MINIAPP_NOTIFY_URL,
                json=payload
            )
            response.raise_for_status()
            
            result_data = response.json()
            if result_data.get("code") != 200:
                logger.error(f"Miniapp rejected the push: {result_data}")
                raise Exception(f"Miniapp returned error code: {result_data.get('code')}")
                
            logger.info(f"Successfully pushed to miniapp for ticket {ticket_no}")
            return {"result": "SUCCESS"}
            
    except httpx.RequestError as e:
        logger.error(f"Request error pushing to miniapp: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error in miniapp push: {str(e)}")
        raise
