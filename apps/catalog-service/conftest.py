import os
import pytest


@pytest.fixture(autouse=True, scope="session")
def _set_test_env():
    os.environ.setdefault("DJANGO_DEBUG", "1")
    os.environ.setdefault("DJANGO_SECRET_KEY", "test-secret")
    os.environ.setdefault(
        "DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1,catalog-service,gateway"
    )
    os.environ.setdefault("CORS_ALLOWED_ORIGINS", "http://localhost:5173")

    os.environ.setdefault("DB_HOST", "localhost")
    os.environ.setdefault("DB_PORT", "3306")
    os.environ.setdefault("DB_NAME", "catalog_db")
    os.environ.setdefault("DB_USER", "root")
    os.environ.setdefault("DB_PASSWORD", "root")
