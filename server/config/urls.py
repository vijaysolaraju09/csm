"""API URL configuration."""
from django.contrib import admin
from django.urls import path
from django.http import JsonResponse


def healthcheck(_request):
    """Simple healthcheck endpoint for container orchestration."""
    return JsonResponse({"status": "ok"})


urlpatterns = [
    path("admin/", admin.site.urls),
    path("health/", healthcheck, name="healthcheck"),
]
