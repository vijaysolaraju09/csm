from django.test import TestCase
from django.utils import timezone

from accounts.models import User
from bookings.models import Booking
from bookings.serializers import BookingSerializer
from services.models import Service


class BookingSerializerTests(TestCase):
    def setUp(self):
        self.provider = User.objects.create_user(
            email="provider@example.com", name="Provider", password="pass12345", role=User.Roles.PROVIDER
        )
        self.consumer = User.objects.create_user(
            email="consumer@example.com", name="Consumer", password="pass12345", role=User.Roles.CONSUMER
        )
        self.service = Service.objects.create(
            owner=self.provider,
            title="Test Service",
            category="cleaning",
            price="100.00",
            location="New York",
            description="Deep cleaning",
        )
        self.booking = Booking.objects.create(
            service=self.service,
            user=self.consumer,
            time_slot=timezone.now() + timezone.timedelta(days=1),
        )

    def test_serializer_includes_nested(self):
        serializer = BookingSerializer(instance=self.booking)
        self.assertEqual(serializer.data["user"]["email"], self.consumer.email)
        self.assertEqual(serializer.data["service_detail"]["title"], "Test Service")
