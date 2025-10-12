from __future__ import annotations

from django.db.models import Q
from rest_framework import viewsets

from .models import Booking
from .permissions import IsBookingOwnerOrServiceOwner
from .serializers import BookingSerializer


class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [IsBookingOwnerOrServiceOwner]

    def get_queryset(self):
        user = self.request.user
        queryset = (
            Booking.objects.select_related("service", "service__owner", "user")
            .all()
        )
        if not user.is_authenticated:
            return Booking.objects.none()
        if getattr(user, "is_provider", False):
            return queryset.filter(Q(user=user) | Q(service__owner=user)).distinct()
        return queryset.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
