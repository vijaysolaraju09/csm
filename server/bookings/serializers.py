from __future__ import annotations

from rest_framework import serializers

from accounts.serializers import UserSerializer
from services.models import Service
from services.serializers import ServiceSerializer

from .models import Booking


class BookingSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    service = serializers.PrimaryKeyRelatedField(queryset=Service.objects.all())
    service_detail = ServiceSerializer(source="service", read_only=True)

    class Meta:
        model = Booking
        fields = [
            "id",
            "service",
            "service_detail",
            "user",
            "time_slot",
            "status",
            "paid",
            "created_at",
        ]
        read_only_fields = ["id", "created_at", "user"]

    def update(self, instance, validated_data):
        validated_data.pop("service", None)
        validated_data.pop("user", None)
        return super().update(instance, validated_data)
