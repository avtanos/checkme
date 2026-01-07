from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Prefer an environment-provided SQLite/DB URL for deployments (e.g., Railway volume)
# Fallback to a local file in the project directory.
env_db_url = (
    os.environ.get("DATABASE_URL")
    or os.environ.get("SQLITE_URL")
    or os.environ.get("SQLITE_PATH")
)

if env_db_url:
    # Normalize plain file paths to sqlite URL
    if env_db_url.startswith("sqlite:///") or env_db_url.startswith("sqlite:////"):
        SQLALCHEMY_DATABASE_URL = env_db_url
    else:
        # Treat as file path
        # Absolute paths should use 4 slashes after scheme on POSIX (sqlite:////abs/path)
        if os.path.isabs(env_db_url):
            SQLALCHEMY_DATABASE_URL = f"sqlite:////{env_db_url.lstrip('/')}"
        else:
            SQLALCHEMY_DATABASE_URL = f"sqlite:///{env_db_url}"
else:
    SQLALCHEMY_DATABASE_URL = "sqlite:///./service_providers.db"

# Ensure target directory exists for sqlite files
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    # Extract filesystem path part
    path_part = SQLALCHEMY_DATABASE_URL.split("sqlite:///", 1)[-1]
    # If it still has leading slashes (absolute), keep as is
    fs_path = path_part
    dir_name = os.path.dirname(fs_path)
    if dir_name and not os.path.exists(dir_name):
        os.makedirs(dir_name, exist_ok=True)

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

