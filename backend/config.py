from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    GEMINI_API_KEY: str
    PINECONE_API_KEY: str
    PINECONE_ENVIRONMENT: str = "gcp-starter"
    PINECONE_INDEX_NAME: str = "lexicase-legal"
    SECRET_KEY: str
    DATABASE_URL: str = "sqlite:///./lexicase.db"
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE: int = 100 * 1024 * 1024  # 100MB
    
    # Mailtrap Email Settings
    MAILTRAP_TOKEN: str = ""
    MAIL_FROM: str = "hello@sliverse.tech"
    SENDER_NAME: str = "Eudia Legal Assistant"

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings():
    return Settings()
