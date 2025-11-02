import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# --- Database Setup ---
# UPDATED FOR PUBLIC DEMO: Remove the SQLite fallback.
# We now strictly require DATABASE_URL to be set in the environment.
try:
    SQLALCHEMY_DATABASE_URL = os.environ["DATABASE_URL"]
except KeyError:
    raise RuntimeError("DATABASE_URL must be set in the environment variables.")

# The 'engine' is the core interface to the database.
# For SQLite, we need to add a special argument `check_same_thread`.
# This isn't needed for PostgreSQL but doesn't hurt.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False} if "sqlite" in SQLALCHEMY_DATABASE_URL else {}
)

# The SessionLocal class is our "session factory." When we call it, it creates a new database session.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# This is our dependency generator. It's the "plumbing" that provides a database
# session to our API endpoints and ensures it's always closed correctly afterward.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()