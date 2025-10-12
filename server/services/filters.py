from django_filters import rest_framework as filters

from .models import Service


class ServiceFilter(filters.FilterSet):
    price_min = filters.NumberFilter(field_name="price", lookup_expr="gte")
    price_max = filters.NumberFilter(field_name="price", lookup_expr="lte")

    class Meta:
        model = Service
        fields = ["category", "location"]
