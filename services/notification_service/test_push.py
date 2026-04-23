from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

response = client.post("/api/v1/miniapp/push", json={
    "message_id": "test-msg-123",
    "event_code": "AUDIT_APPROVED",
    "event_name": "Audit Approved",
    "ticket_no": "TKT-001",
    "event_time": "2026-04-23T12:00:00Z",
    "summary": "Your audit has been approved."
})

print(response.status_code)
print(response.json())
