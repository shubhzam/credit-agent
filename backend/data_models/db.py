import os
import urllib.parse
from dotenv import load_dotenv
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine

load_dotenv()  # reads .env into env vars

# Pull values from environment
driver   = os.getenv("DB_DRIVER")
server   = os.getenv("DB_SERVER")
database = os.getenv("DB_NAME")
username = os.getenv("DB_USER")
password = os.getenv("DB_PASS")

# Quote the ODBC connection string
odbc_str = (
    f"DRIVER={{{driver}}};"
    f"SERVER={server};"
    f"DATABASE={database};"
    f"UID={username};"
    f"PWD={password}"
)
agentic_automation_params = urllib.parse.quote_plus(odbc_str)

# Final SQLAlchemy URL
DATABASE_URL = f"mssql+aioodbc:///?odbc_connect={agentic_automation_params}"

engine = create_async_engine(
    DATABASE_URL,
    echo=True,            
    future=True
)

AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

Base = declarative_base()

async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()




