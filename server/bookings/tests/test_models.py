from django.test import TestCase
from django.utils import timezone

from accounts.models import User
from bookings.models import Booking
from services.models import Service


class BookingModelTests(TestCase):
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

    def test_booking_defaults(self):
        booking = Booking.objects.create(
            service=self.service,
            user=self.consumer,
            time_slot=timezone.now() + timezone.timedelta(days=1),
        )
        self.assertEqual(booking.status, Booking.Status.PENDING)
        self.assertFalse(booking.paid)
        self.assertIn(self.consumer.email, str(booking))
