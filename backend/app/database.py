from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

environment = os.getenv(
    "ENVIRONMENT",
    "dev"
)

load_dotenv( f".env.{environment}" )

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise Exception(
        "Apontamento do banco de dados não encontrado (DATABASE_URL)"
    )

# testar validade da conexão
engine = create_engine(

    DATABASE_URL,

    pool_pre_ping=True,

    connect_args={
        "ssl": {
            "ssl_disabled": False
        }
    }
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()