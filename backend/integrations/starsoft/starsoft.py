import pyodbc
import os
from dotenv import load_dotenv


SERVER = os.getenv("STARSOFT_HOST")
DATABASE = os.getenv("STARSOFT_DATABASE")
USERNAME = os.getenv("STARSOFT_USER")
PASSWORD = os.getenv("STARSOFT_PASSWORD")


def get_connection():

    connection = pyodbc.connect(
        f"DRIVER={{ODBC Driver 18 for SQL Server}};"
        f"SERVER={SERVER};"
        f"DATABASE={DATABASE};"
        f"UID={USERNAME};"
        f"PWD={PASSWORD};"
        "TrustServerCertificate=yes;"
    )

    return connection