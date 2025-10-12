from django.test import TestCase

from accounts.models import User
from services.models import Service
from services.serializers import ServiceSerializer


class ServiceSerializerTests(TestCase):
    def setUp(self):
        self.provider = User.objects.create_user(
            email="provider@example.com", name="Provider", password="pass12345", role=User.Roles.PROVIDER
        )
        self.service = Service.objects.create(
            owner=self.provider,
            title="Test Service",
            category="cleaning",
            price="100.00",
            location="New York",
            description="Deep cleaning",
        )

    def test_serializer_output(self):
        serializer = ServiceSerializer(instance=self.service)
        self.assertEqual(serializer.data["owner"]["email"], self.provider.email)
        self.assertEqual(serializer.data["title"], "Test Service")
