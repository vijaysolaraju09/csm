from django.test import TestCase
from django.utils import timezone

from accounts.models import User
from bookings.models import Booking
from reviews.serializers import ReviewSerializer
from services.models import Service


class ReviewSerializerTests(TestCase):
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
            status=Booking.Status.CONFIRMED,
            paid=True,
        )

    def test_validate_booking_requires_user(self):
        serializer = ReviewSerializer(data={"booking": self.booking.pk, "rating": 5}, context={"request": type("obj", (), {"user": self.provider})()})
        self.assertFalse(serializer.is_valid())
        self.assertIn("booking", serializer.errors)

    def test_create_review(self):
        request = type("obj", (), {"user": self.consumer})()
        serializer = ReviewSerializer(data={"booking": self.booking.pk, "rating": 4, "comment": "Good"}, context={"request": request})
        self.assertTrue(serializer.is_valid(), serializer.errors)
        review = serializer.save()
        self.assertEqual(review.booking, self.booking)
        self.assertEqual(review.rating, 4)
