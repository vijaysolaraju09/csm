from django.test import TestCase

from accounts.models import User
from services.models import Service


class ServiceModelTests(TestCase):
    def setUp(self):
        self.provider = User.objects.create_user(
            email="provider@example.com", name="Provider", password="pass12345", role=User.Roles.PROVIDER
        )

    def test_service_creation(self):
        service = Service.objects.create(
            owner=self.provider,
            title="Test Service",
            category="cleaning",
            price="100.00",
            location="New York",
            description="Deep cleaning",
        )
        self.assertEqual(service.owner, self.provider)
        self.assertEqual(service.category, "cleaning")
        self.assertEqual(str(service), "Test Service")
