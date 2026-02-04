from django.urls import path
from .views import health, ProductListAPIView

urlpatterns = [
    path("health/", health, name="health"),
    path("products/", ProductListAPIView.as_view()),
]
