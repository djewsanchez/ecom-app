import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient

@pytest.mark.django_db
def test_login_and_me():
    User.objects.create_user(
        username="test@example.com",
        email="test@example.com",
        password="strongpassword123"
    )

    client = APIClient()

    login = client.post("/login/", {
        "email": "test@example.com",
        "password": "strongpassword123"
    }, format="json")

    assert login.status_code == 200
    token = login.data["access"]

    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    me = client.get("/me/")

    assert me.status_code == 200
    assert me.data["email"] == "test@example.com"