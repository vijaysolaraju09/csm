from django.test import TestCase
from django.utils import timezone

from accounts.models import User
from bookings.models import Booking
from reviews.models import Review
from services.models import Service


class ReviewModelTests(TestCase):
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

    def test_review_creation(self):
        review = Review.objects.create(booking=self.booking, rating=5, comment="Great service")
        self.assertEqual(review.rating, 5)
        self.assertEqual(str(review), f"Review for booking {self.booking.id}")
