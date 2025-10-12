from __future__ import annotations

from rest_framework import serializers

from accounts.serializers import UserSerializer

from .models import Service


class ServiceSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)

    class Meta:
        model = Service
        fields = [
            "id",
            "owner",
            "title",
            "category",
            "price",
            "location",
            "description",
            "created_at",
        ]
        read_only_fields = ["id", "created_at", "owner"]
