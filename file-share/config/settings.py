from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # --- Database ---
    MONGODB_URL: str
    DATABASE_NAME: str

    # --- Auth / JWT ---
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    # --- Upload ---
    UPLOAD_DIR: str
    MAX_FILE_SIZE_MB: int

    # --- Server ---
    HOST: str
    PORT: int

    # --- Steganography ---
    STEGO_SECRET_KEY: str

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="forbid"   # 👈 default, but explicit is good
    )


settings = Settings()
