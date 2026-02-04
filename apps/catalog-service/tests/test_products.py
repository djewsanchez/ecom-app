import pytest
from core.models import Product
from rest_framework.test import APIClient


@pytest.mark.django_db
def test_list_products():
    Product.objects.create(name="Laptop", price_cents=100000)

    client = APIClient()
    resp = client.get("/products/")

    assert resp.status_code == 200
    assert len(resp.data) == 1
