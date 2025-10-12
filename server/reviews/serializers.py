from __future__ import annotations

from rest_framework import serializers

from bookings.models import Booking
from bookings.serializers import BookingSerializer

from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    booking = serializers.PrimaryKeyRelatedField(queryset=Booking.objects.all())
    booking_detail = BookingSerializer(source="booking", read_only=True)

    class Meta:
        model = Review
        fields = ["id", "booking", "booking_detail", "rating", "comment", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_booking(self, booking):
        request = self.context.get("request")
        if request and booking.user != request.user:
            raise serializers.ValidationError("You can only review your own bookings.")
        if hasattr(booking, "review"):
            raise serializers.ValidationError("This booking already has a review.")
        return booking

    def update(self, instance, validated_data):
        validated_data.pop("booking", None)
        return super().update(instance, validated_data)
