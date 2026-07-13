from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
from urllib.parse import quote_plus as qp

password = qp('Br3ntw00d@WP26')

DATABASE_URL = f"mysql+pymysql://scdeveloper:{password}@scdeveloper.mysql.dbaas.com.br/scdeveloper"


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
