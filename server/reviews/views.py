from __future__ import annotations

from django.db.models import Q
from rest_framework import viewsets

from .models import Review
from .permissions import IsReviewAuthorOrServiceOwner
from .serializers import ReviewSerializer


class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [IsReviewAuthorOrServiceOwner]

    def get_queryset(self):
        user = self.request.user
        queryset = Review.objects.select_related(
            "booking",
            "booking__service",
            "booking__service__owner",
            "booking__user",
        )
        if not user.is_authenticated:
            return Review.objects.none()
        return queryset.filter(Q(booking__user=user) | Q(booking__service__owner=user)).distinct()

    def perform_create(self, serializer):
        serializer.save()
