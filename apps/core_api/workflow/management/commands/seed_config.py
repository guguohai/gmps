import re
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.db import connection, transaction
from django.utils import timezone

try:
    import yaml
except ImportError:  # pragma: no cover
    yaml = None


SEED_FILES = [
    "01_init_sys_role.sql",
    "02_init_sys_permission.sql",
    "03_init_sys_role_permission.sql",
    "04_init_wf_status.sql",
    "05_init_wf_action.sql",
    "06_init_wf_transition.sql",
    "07_init_wf_action_permission.sql",
    "08_init_wf_auto_rule.sql",
    "09_init_sys_dict_item.sql",
    "10_init_notification_template.sql",
]

REPLACE_TABLES = [
    "notification_template",
    "wf_auto_rule",
    "wf_action_permission",
    "wf_transition",
    "wf_action",
    "wf_status",
    "sys_dict_item",
    "sys_role_permission",
    "sys_permission",
    "sys_role",
]

INSERT_RE = re.compile(
    r"^\s*INSERT\s+INTO\s+`?(?P<table>[a-zA-Z0-9_]+)`?\s*"
    r"\((?P<columns>.*?)\)\s*VALUES\s+(?P<values>.*)\s*$",
    re.IGNORECASE | re.DOTALL,
)


class Command(BaseCommand):
    help = "Load configurable seed data from infra/sql/init-sql with upsert/replace/validate modes."

    def add_arguments(self, parser):
        parser.add_argument(
            "--mode",
            choices=["upsert", "replace", "validate"],
            default="upsert",
            help="upsert updates existing rows, replace clears seed tables first, validate checks SQL only.",
        )
        parser.add_argument(
            "--source",
            default=None,
            help="Seed source directory. Defaults to <repo>/infra/seed when YAML exists, otherwise infra/sql/init-sql.",
        )
        parser.add_argument(
            "--format",
            choices=["auto", "yaml", "sql"],
            default="auto",
            help="Seed source format.",
        )
        parser.add_argument(
            "--yes",
            action="store_true",
            help="Required for replace mode.",
        )

    def handle(self, *args, **options):
        source_format, source = self._resolve_source(options["source"], options["format"])
        mode = options["mode"]

        if source_format == "yaml":
            statements = build_statements_from_yaml(source)
        else:
            statements = build_statements_from_sql(source)

        validate_statements(statements)

        if mode == "validate":
            self.stdout.write(self.style.SUCCESS(f"Validated {len(statements)} {source_format} seed statements from {source}"))
            return

        if mode == "replace" and not options["yes"]:
            raise CommandError("replace mode clears seed tables. Re-run with --yes to confirm.")

        executable = [
            (filename, to_upsert_sql(statement) if mode == "upsert" else statement)
            for filename, statement in statements
        ]

        with transaction.atomic():
            with connection.cursor() as cursor:
                cursor.execute("SET FOREIGN_KEY_CHECKS = 0")
                if mode == "replace":
                    for table in REPLACE_TABLES:
                        cursor.execute(f"DELETE FROM {table}")
                for filename, statement in executable:
                    try:
                        cursor.execute(statement)
                    except Exception as exc:
                        raise CommandError(f"Failed executing {filename}: {exc}") from exc
                cursor.execute("SET FOREIGN_KEY_CHECKS = 1")

        self.stdout.write(self.style.SUCCESS(f"Seed config {mode} completed from {source_format}: {len(executable)} statements"))

    def _resolve_source(self, explicit, source_format):
        repo_root = settings.BASE_DIR.parent.parent
        if explicit:
            source = Path(explicit).resolve()
            if source_format == "auto":
                source_format = "yaml" if any(source.glob("*.yaml")) else "sql"
            return source_format, source

        yaml_source = repo_root / "infra" / "seed"
        sql_source = repo_root / "infra" / "sql" / "init-sql"

        if source_format == "yaml":
            return "yaml", yaml_source
        if source_format == "sql":
            return "sql", sql_source
        if yaml_source.exists() and any(yaml_source.glob("*.yaml")):
            return "yaml", yaml_source
        return "sql", sql_source


def build_statements_from_sql(source):
    files = [source / name for name in SEED_FILES]
    missing = [str(path) for path in files if not path.exists()]
    if missing:
        raise CommandError(f"Missing seed SQL files: {', '.join(missing)}")

    statements = []
    for path in files:
        sql = strip_line_comments(path.read_text(encoding="utf-8-sig"))
        parsed = split_sql_statements(sql)
        if not parsed:
            raise CommandError(f"No executable SQL statements found in {path}")
        statements.extend((path.name, statement) for statement in parsed)
    return statements


def build_statements_from_yaml(source):
    if yaml is None:
        raise CommandError("PyYAML is required for YAML seed files. Install pyyaml or use --format sql.")

    files = [
        source / "roles.yaml",
        source / "workflow.ticket.yaml",
        source / "notification_templates.yaml",
    ]
    missing = [str(path) for path in files if not path.exists()]
    if missing:
        raise CommandError(f"Missing seed YAML files: {', '.join(missing)}")

    statements = []
    for path in files:
        data = yaml.safe_load(path.read_text(encoding="utf-8-sig")) or {}
        statements.extend(yaml_to_statements(path.name, data))
    return statements


def yaml_to_statements(filename, data):
    statements = []

    for source_row in data.get("roles", []):
        row = dict(source_row)
        statements.append((filename, insert_sql("sys_role", row)))

    permission_parent_updates = []
    for source_row in data.get("permissions", []):
        row = dict(source_row)
        parent_code = row.pop("parent_code", None)
        statements.append((filename, insert_sql("sys_permission", row)))
        if parent_code:
            permission_parent_updates.append((row["permission_code"], parent_code))

    for permission_code, parent_code in permission_parent_updates:
        statements.append(
            (
                filename,
                "UPDATE sys_permission child "
                "JOIN sys_permission parent "
                f"ON parent.permission_code = {sql_literal(parent_code)} "
                "SET child.parent_id = parent.id "
                f"WHERE child.permission_code = {sql_literal(permission_code)}",
            )
        )

    for source_row in data.get("role_permissions", []):
        row = dict(source_row)
        role_code = row.pop("role_code")
        permission_code = row.pop("permission_code")
        row["role_id"] = f"(SELECT id FROM sys_role WHERE role_code = {sql_literal(role_code)})"
        row["permission_id"] = f"(SELECT id FROM sys_permission WHERE permission_code = {sql_literal(permission_code)})"
        statements.append((filename, insert_sql("sys_role_permission", row)))

    dict_parent_updates = []
    for source_row in data.get("dict_items", []):
        row = dict(source_row)
        parent_code = row.pop("parent_code", None)
        statements.append((filename, insert_sql("sys_dict_item", row)))
        if parent_code:
            dict_parent_updates.append((row["dict_code"], parent_code))

    for dict_code, parent_code in dict_parent_updates:
        statements.append(
            (
                filename,
                "UPDATE sys_dict_item child "
                "JOIN sys_dict_item parent "
                f"ON parent.dict_code = {sql_literal(parent_code)} "
                "SET child.parent_id = parent.id "
                f"WHERE child.dict_code = {sql_literal(dict_code)}",
            )
        )

    for source_row in data.get("statuses", []):
        row = dict(source_row)
        statements.append((filename, insert_sql("wf_status", row)))

    for source_row in data.get("actions", []):
        row = dict(source_row)
        statements.append((filename, insert_sql("wf_action", row)))

    for source_row in data.get("transitions", []):
        row = dict(source_row)
        statements.append((filename, insert_sql("wf_transition", row)))

    for source_row in data.get("action_permissions", []):
        row = dict(source_row)
        statements.append((filename, insert_sql("wf_action_permission", row)))

    for source_row in data.get("auto_rules", []):
        row = dict(source_row)
        statements.append((filename, insert_sql("wf_auto_rule", row)))

    for source_row in data.get("templates", []):
        row = dict(source_row)
        statements.append((filename, insert_sql("notification_template", row)))

    return statements


def insert_sql(table, row):
    payload = dict(row)
    now = timezone.now()
    if table != "sys_dict_item":
        payload.setdefault("created_at", now)
    payload.setdefault("updated_at", now)
    columns = list(payload.keys())
    values = [sql_value(payload[column]) for column in columns]
    return f"INSERT INTO {table} ({', '.join(columns)}) VALUES ({', '.join(values)})"


def sql_value(value):
    if isinstance(value, str) and value.startswith("(SELECT "):
        return value
    return sql_literal(value)


def sql_literal(value):
    if value is None:
        return "NULL"
    if isinstance(value, bool):
        return "1" if value else "0"
    if isinstance(value, (int, float)):
        return str(value)
    if hasattr(value, "isoformat"):
        value = value.isoformat(sep=" ") if hasattr(value, "hour") else value.isoformat()
    text = str(value).replace("\\", "\\\\").replace("'", "''")
    return f"'{text}'"


def strip_line_comments(sql):
    lines = []
    for line in sql.splitlines():
        stripped = line.lstrip()
        if stripped.startswith("--"):
            continue
        lines.append(line)
    return "\n".join(lines)


def split_sql_statements(sql):
    statements = []
    current = []
    quote = None
    escape = False

    for char in sql:
        current.append(char)

        if quote:
            if escape:
                escape = False
            elif char == "\\":
                escape = True
            elif char == quote:
                quote = None
            continue

        if char in {"'", '"'}:
            quote = char
            continue

        if char == ";":
            statement = "".join(current).strip()
            current = []
            if statement:
                statements.append(statement[:-1].strip())

    tail = "".join(current).strip()
    if tail:
        statements.append(tail)

    return [
        statement
        for statement in statements
        if statement and not statement.upper().startswith("SET ") and not statement.upper().startswith("SOURCE ")
    ]


def validate_statements(statements):
    for filename, statement in statements:
        upper = statement.lstrip().upper()
        if upper.startswith("INSERT INTO"):
            match = INSERT_RE.match(statement)
            if not match:
                raise CommandError(f"Unsupported INSERT format in {filename}")
            columns = parse_columns(match.group("columns"))
            if not columns:
                raise CommandError(f"No columns found in {filename}")
        elif upper.startswith("UPDATE "):
            continue
        else:
            raise CommandError(f"Unsupported statement in {filename}: {statement[:80]}")


def to_upsert_sql(statement):
    if not statement.lstrip().upper().startswith("INSERT INTO"):
        return statement
    if "ON DUPLICATE KEY UPDATE" in statement.upper():
        return statement

    match = INSERT_RE.match(statement)
    if not match:
        raise CommandError(f"Unsupported INSERT format: {statement[:80]}")

    columns = parse_columns(match.group("columns"))
    update_columns = [
        column
        for column in columns
        if column.lower() not in {"id", "created_at"}
    ]
    if not update_columns:
        return statement

    assignments = []
    for column in update_columns:
        if column.lower() == "updated_at":
            assignments.append(f"{column} = NOW()")
        else:
            assignments.append(f"{column} = VALUES({column})")

    return f"{statement}\nON DUPLICATE KEY UPDATE\n  " + ",\n  ".join(assignments)


def parse_columns(raw_columns):
    return [
        item.strip().strip("`")
        for item in raw_columns.replace("\n", " ").split(",")
        if item.strip()
    ]
