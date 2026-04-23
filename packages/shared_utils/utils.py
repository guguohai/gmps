import datetime

def get_current_timestamp():
    """Returns the current UTC timestamp."""
    return datetime.datetime.utcnow().isoformat()

def format_date(dt, fmt="%Y-%m-%d"):
    """Formats a datetime object."""
    return dt.strftime(fmt)
