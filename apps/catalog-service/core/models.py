from django.db import models


class Product(models.Model):
    name = models.CharField(max_length=200)
    price_cents = models.PositiveIntegerField()
    description = models.TextField(blank=True)
