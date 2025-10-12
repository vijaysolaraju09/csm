"""API URL configuration."""
from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path
from rest_framework import routers

from bookings.views import BookingViewSet
from reviews.views import ReviewViewSet
from services.views import ServiceViewSet


def healthcheck(_request):
    """Simple healthcheck endpoint for container orchestration."""
    return JsonResponse({"status": "ok"})


router = routers.DefaultRouter()
router.register("services", ServiceViewSet, basename="service")
router.register("bookings", BookingViewSet, basename="booking")
router.register("reviews", ReviewViewSet, basename="review")


urlpatterns = [
    path("admin/", admin.site.urls),
    path("health/", healthcheck, name="healthcheck"),
    path("api/auth/", include("accounts.urls")),
    path("api/", include(router.urls)),
]
