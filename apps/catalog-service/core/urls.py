from django.urls import path
from .views import CreateOrderAPIView, MyOrdersAPIView, health, ProductListAPIView

urlpatterns = [
    path("health/", health, name="health"),
    path("products/", ProductListAPIView.as_view()),
    path("orders/", CreateOrderAPIView.as_view()),
    path("orders/my/", MyOrdersAPIView.as_view()),
]
