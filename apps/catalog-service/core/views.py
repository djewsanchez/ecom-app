from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from core.models import Product, Order
from core.serializers.products import (
    ProductSerializer,
)
from core.serializers.orders import (
    OrderCreateSerializer,
    OrderOutSerializer,
)
from core.services.orders import create_order


@api_view(["GET"])
def health(request):
    return Response({"status": "ok"})


class ProductListAPIView(ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class CreateOrderAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        s = OrderCreateSerializer(data=request.data)
        s.is_valid(raise_exception=True)

        user_id = (
            request.auth.get("user_id")
            if hasattr(request, "auth") and request.auth
            else None
        )
        if not user_id:
            # fallback if you store it elsewhere
            user_id = getattr(request.user, "id", None) or 0

        order = create_order(user_id=int(user_id), items=s.validated_data["items"])
        return Response(OrderOutSerializer(order).data, status=status.HTTP_201_CREATED)


class MyOrdersAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = (
            request.auth.get("user_id")
            if hasattr(request, "auth") and request.auth
            else None
        )
        if not user_id:
            user_id = getattr(request.user, "id", None) or 0

        qs = Order.objects.filter(user_id=int(user_id)).order_by("-created_at")
        return Response([OrderOutSerializer(o).data for o in qs])
