from rest_framework import serializers
from core.models import Order, OrderItem


class OrderItemOutSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ["product_id", "quantity", "unit_price_cents"]


class OrderOutSerializer(serializers.ModelSerializer):
    items = OrderItemOutSerializer(many=True)

    class Meta:
        model = Order
        fields = ["id", "user_id", "total_cents", "created_at", "items"]


class OrderCreateItemSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)


class OrderCreateSerializer(serializers.Serializer):
    items = OrderCreateItemSerializer(many=True)
