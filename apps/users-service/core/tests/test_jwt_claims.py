import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient


@pytest.mark.django_db
def test_login_access_token_contains_user_id_claim():
    User.objects.create_user(
        username="test@example.com",
        email="test@example.com",
        password="strongpassword123",
    )

    client = APIClient()
    resp = client.post(
        "/login/",
        {"email": "test@example.com", "password": "strongpassword123"},
        format="json",
    )

    assert resp.status_code == 200
    assert "access" in resp.data

    access = resp.data["access"]

    # Decode without verifying signature (test just checks payload has claim)
    import jwt

    payload = jwt.decode(access, options={"verify_signature": False})

    assert payload["user_id"] > 0
