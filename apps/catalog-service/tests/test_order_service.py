import pytest
from core.models import Product
from core.services.orders import create_order


@pytest.mark.django_db
def test_create_order_computes_total_and_items():
    p1 = Product.objects.create(name="Laptop", price_cents=100000)
    order = create_order(user_id=123, items=[{"product_id": p1.id, "quantity": 2}])

    assert order.user_id == 123
    assert order.total_cents == 200000
    assert order.items.count() == 1
    item = order.items.first()
    assert item.product_id == p1.id
    assert item.quantity == 2
    assert item.unit_price_cents == 100000
