import pytest
from rest_framework.test import APIClient
from core.models import Product
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth.models import User


def make_token(user_id: int) -> str:
    token = AccessToken()
    token["user_id"] = user_id
    return str(token)


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def authenticated_user(api_client):
    # This runs BEFORE the test
    user = User.objects.create(id=123, username="testuser")
    token = make_token(user_id=user.id)
    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    return user


@pytest.fixture
def product_laptop(api_client):
    # This runs BEFORE the test
    return Product.objects.create(name="Laptop", price_cents=100000)


@pytest.mark.django_db
def test_create_order_requires_auth(api_client, product_laptop):
    resp = api_client.post(
        "/orders/", {"items": [{"product_id": 1, "quantity": 1}]}, format="json"
    )
    assert resp.status_code == 401


@pytest.mark.django_db
def test_create_order_success_with_auth(api_client, product_laptop, authenticated_user):
    resp = api_client.post(
        "/orders/",
        {"items": [{"product_id": product_laptop.id, "quantity": 2}]},
        format="json",
    )
    assert resp.status_code == 201
    assert resp.data["user_id"] == 123
    assert resp.data["total_cents"] == 200000
    assert len(resp.data["items"]) == 1


@pytest.mark.django_db
def test_my_orders_returns_only_user_orders(
    api_client, product_laptop, authenticated_user
):
    api_client.post(
        "/orders/",
        {"items": [{"product_id": product_laptop.id, "quantity": 1}]},
        format="json",
    )

    resp = api_client.get("/orders/my/")
    assert resp.status_code == 200
    assert len(resp.data) == 1
    assert resp.data[0]["user_id"] == 123
