from dotenv import load_dotenv
import os

load_dotenv(".env.example")

SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "sraGbRmjYQXmYdnrgPk!OFE35UP6n/QqeoED=iu/bUXBFSSPwnsuprP6T45Qsbwyw"
    "u2khUka!6IIleY",
)
if not SECRET_KEY:
    SECRET_KEY = os.urandom(32)

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 120
REFRESH_TOKEN_EXPIRE_MINUTES = 15 * 24 * 60  # 15 days


POSTGRES_HOST = os.getenv("POSTGRES_HOST", "0.0.0.0")
POSTGRES_PORT = os.getenv("POSTGRES_PORT", "5432")
POSTGRES_USER = os.getenv("POSTGRES_USER", "user")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "password")
POSTGRES_DB = os.getenv("POSTGRES_DB", "app-notes")
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
