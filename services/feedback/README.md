# PS FastAPI

FastAPI service for saving feedback records to SQLite.

## Setup

```powershell
cd pyapi
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
```

Edit `.env` if needed:

- `SQLITE_PATH`: SQLite database path. Defaults to `data/feedback.sqlite3`.
- `ALLOWED_ORIGINS`: comma-separated frontend origins.

## Run

```powershell
uvicorn app.main:app --reload --port 8000
```

## API

`POST /api/feedback`

```json
{
  "title": "Layout feedback",
  "content": "Please keep filters expanded.",
  "author": "Admin",
  "source": "ps-v3"
}
```

`GET /api/feedback`

Returns saved feedback records.

`GET /api/feedback/{feedback_id}`

Returns one saved feedback record.

`PUT /api/feedback/{feedback_id}`

Updates one saved feedback record.
