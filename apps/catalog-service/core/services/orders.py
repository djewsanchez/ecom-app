from django.db import transaction
from core.models import Product, Order, OrderItem


@transaction.atomic
def create_order(user_id: int, items: list[dict]) -> Order:
    if not items:
        raise ValueError("items_required")

    product_ids = [i["product_id"] for i in items]
    products = {p.id: p for p in Product.objects.filter(id__in=product_ids)}

    total = 0
    order = Order.objects.create(user_id=user_id, total_cents=0)

    for i in items:
        pid = i["product_id"]
        qty = i["quantity"]
        if pid not in products:
            raise ValueError("product_not_found")
        if qty < 1:
            raise ValueError("invalid_quantity")

        unit = products[pid].price_cents
        total += unit * qty
        OrderItem.objects.create(
            order=order, product_id=pid, quantity=qty, unit_price_cents=unit
        )

    order.total_cents = total
    order.save(update_fields=["total_cents"])
    return order
