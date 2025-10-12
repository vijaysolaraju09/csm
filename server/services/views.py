from __future__ import annotations

from rest_framework import viewsets

from .filters import ServiceFilter
from .models import Service
from .permissions import IsServiceOwnerOrReadOnly
from .serializers import ServiceSerializer


class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [IsServiceOwnerOrReadOnly]
    filterset_class = ServiceFilter
    search_fields = ["title", "description"]
    ordering_fields = ["price", "created_at"]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def perform_update(self, serializer):
        serializer.save(owner=self.request.user)
