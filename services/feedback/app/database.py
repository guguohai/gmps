import sqlite3
from contextlib import contextmanager
from datetime import datetime
from pathlib import Path
from typing import Iterator

from .schemas import FeedbackRecord


def ensure_database(db_path: str) -> None:
    path = Path(db_path)
    path.parent.mkdir(parents=True, exist_ok=True)

    with sqlite3.connect(path) as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS feedback (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                author TEXT,
                source TEXT,
                category TEXT NOT NULL DEFAULT 'global',
                status TEXT NOT NULL DEFAULT 'unread',
                created_at TEXT NOT NULL,
                update_dt TEXT NOT NULL
            )
            """
        )
        columns = {row[1] for row in conn.execute("PRAGMA table_info(feedback)").fetchall()}
        if "category" not in columns:
            conn.execute("ALTER TABLE feedback ADD COLUMN category TEXT NOT NULL DEFAULT 'global'")
        if "status" not in columns:
            conn.execute("ALTER TABLE feedback ADD COLUMN status TEXT NOT NULL DEFAULT 'unread'")
        if "update_dt" not in columns:
            conn.execute("ALTER TABLE feedback ADD COLUMN update_dt TEXT")
            conn.execute("UPDATE feedback SET update_dt = created_at WHERE update_dt IS NULL")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_feedback_category ON feedback(category)")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC)")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_feedback_update_dt ON feedback(update_dt DESC)")
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS auth_tokens (
                token TEXT PRIMARY KEY,
                username TEXT NOT NULL,
                expires_at TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )
        conn.execute("CREATE INDEX IF NOT EXISTS idx_auth_tokens_expires_at ON auth_tokens(expires_at)")


@contextmanager
def connect(db_path: str) -> Iterator[sqlite3.Connection]:
    ensure_database(db_path)
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def insert_feedback(db_path: str, record: FeedbackRecord) -> FeedbackRecord:
    with connect(db_path) as conn:
        conn.execute(
            """
            INSERT INTO feedback (id, title, content, author, source, category, status, created_at, update_dt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                record.id,
                record.title,
                record.content,
                record.author,
                record.source,
                record.category,
                record.status,
                record.created_at.isoformat(),
                record.update_dt.isoformat(),
            ),
        )
    return record


def update_feedback(db_path: str, feedback_id: str, record: FeedbackRecord) -> FeedbackRecord | None:
    with connect(db_path) as conn:
        cursor = conn.execute(
            """
            UPDATE feedback
            SET title = ?, content = ?, author = ?, source = ?, category = ?, status = ?, update_dt = ?
            WHERE id = ?
            """,
            (
                record.title,
                record.content,
                record.author,
                record.source,
                record.category,
                record.status,
                record.update_dt.isoformat(),
                feedback_id,
            ),
        )

    return record if cursor.rowcount else None


def delete_feedback(db_path: str, feedback_id: str) -> bool:
    with connect(db_path) as conn:
        cursor = conn.execute("DELETE FROM feedback WHERE id = ?", (feedback_id,))

    return cursor.rowcount > 0


def list_feedback(db_path: str, category: str | None = None) -> list[FeedbackRecord]:
    with connect(db_path) as conn:
        if category:
            rows = conn.execute(
                """
                SELECT id, title, content, author, source, category, status, created_at, update_dt
                FROM feedback
                WHERE category = ?
                ORDER BY created_at DESC
                """,
                (category,),
            ).fetchall()
        else:
            rows = conn.execute(
                """
                SELECT id, title, content, author, source, category, status, created_at, update_dt
                FROM feedback
                ORDER BY created_at DESC
                """
            ).fetchall()

    return [row_to_record(row) for row in rows]


def get_feedback(db_path: str, feedback_id: str) -> FeedbackRecord | None:
    with connect(db_path) as conn:
        row = conn.execute(
            """
            SELECT id, title, content, author, source, category, status, created_at, update_dt
            FROM feedback
            WHERE id = ?
            """,
            (feedback_id,),
        ).fetchone()

    return row_to_record(row) if row else None


def insert_auth_token(
    db_path: str,
    token: str,
    username: str,
    expires_at: datetime,
    created_at: datetime,
) -> None:
    with connect(db_path) as conn:
        conn.execute(
            """
            INSERT INTO auth_tokens (token, username, expires_at, created_at)
            VALUES (?, ?, ?, ?)
            """,
            (token, username, expires_at.isoformat(), created_at.isoformat()),
        )


def get_auth_token(db_path: str, token: str) -> sqlite3.Row | None:
    with connect(db_path) as conn:
        return conn.execute(
            """
            SELECT token, username, expires_at, created_at
            FROM auth_tokens
            WHERE token = ?
            """,
            (token,),
        ).fetchone()


def delete_auth_token(db_path: str, token: str) -> None:
    with connect(db_path) as conn:
        conn.execute("DELETE FROM auth_tokens WHERE token = ?", (token,))


def delete_expired_auth_tokens(db_path: str, now: datetime) -> None:
    with connect(db_path) as conn:
        conn.execute("DELETE FROM auth_tokens WHERE expires_at <= ?", (now.isoformat(),))


def row_to_record(row: sqlite3.Row) -> FeedbackRecord:
    return FeedbackRecord(
        id=row["id"],
        title=row["title"],
        content=row["content"],
        author=row["author"],
        source=row["source"],
        category=row["category"],
        status=row["status"],
        created_at=datetime.fromisoformat(row["created_at"]),
        update_dt=datetime.fromisoformat(row["update_dt"] or row["created_at"]),
    )
