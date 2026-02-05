from django.db import models


class Product(models.Model):
    name = models.CharField(max_length=200)
    price_cents = models.PositiveIntegerField()
    description = models.TextField(blank=True)


class Order(models.Model):
    user_id = models.PositiveIntegerField()
    total_cents = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    product_id = models.PositiveIntegerField()
    quantity = models.PositiveIntegerField()
    unit_price_cents = models.PositiveIntegerField()
