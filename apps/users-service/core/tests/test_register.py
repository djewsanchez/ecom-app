import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient

@pytest.mark.django_db
def test_register_success():
    client = APIClient()
    payload = {
        "email": "test@example.com",
        "password": "strongpassword123"
    }

    response = client.post("/register/", payload, format="json")

    assert response.status_code == 201
    assert User.objects.filter(email="test@example.com").exists()

@pytest.mark.django_db
def test_register_duplicate_email_fails():
    User.objects.create_user(username="test", email="test@example.com", password="pass1234")

    client = APIClient()
    payload = {
        "email": "test@example.com",
        "password": "strongpassword123"
    }

    response = client.post("/register/", payload, format="json")

    assert response.status_code == 400
