from django.urls import path
from .views import LoginAPIView, MeAPIView, RegisterAPIView, health

urlpatterns = [
    path("health/", health, name="health"),
    path("register/", RegisterAPIView.as_view()),
    path("login/", LoginAPIView.as_view()),
    path("me/", MeAPIView.as_view()),
]