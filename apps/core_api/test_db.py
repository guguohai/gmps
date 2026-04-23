import os
import django
from django.db import connections
from django.db.utils import OperationalError

def test_connection():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    django.setup()
    db_conn = connections['default']
    try:
        db_conn.cursor()
        print("[Success] Django successfully connected to MySQL database!")
        print(f"   Database: {db_conn.settings_dict['NAME']}")
        print(f"   Host: {db_conn.settings_dict['HOST']}")
    except OperationalError as e:
        print("[Failure] Django could not connect to MySQL.")
        print(f"   Error: {e}")
    except Exception as e:
        print(f"[Error] An unexpected error occurred: {e}")

if __name__ == "__main__":
    test_connection()
