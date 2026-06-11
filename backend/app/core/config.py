from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Content Gen SaaS"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "db67dc6b4d522d51e83bab8c3fc60f3e66e9e7f1ebaed478f5e381c5a79ee0c3"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8 # 8 days
    DATABASE_URL: str = "postgresql://pranav@localhost:5432/saas_db"
    OPENAI_API_KEY: str = "sk-placeholder"

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
