from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User
from bookings.models import Booking
from reviews.models import Review
from services.models import Service


class ReviewViewSetTests(APITestCase):
    def setUp(self):
        self.provider = User.objects.create_user(
            email="provider@example.com", name="Provider", password="pass12345", role=User.Roles.PROVIDER
        )
        self.consumer = User.objects.create_user(
            email="consumer@example.com", name="Consumer", password="pass12345", role=User.Roles.CONSUMER
        )
        self.service = Service.objects.create(
            owner=self.provider,
            title="Deep Cleaning",
            category="cleaning",
            price="150.00",
            location="New York",
            description="Apartment cleaning",
        )
        self.booking = Booking.objects.create(
            service=self.service,
            user=self.consumer,
            time_slot=timezone.now() + timezone.timedelta(days=1),
            status=Booking.Status.CONFIRMED,
            paid=True,
        )
        self.list_url = reverse("review-list")

    def test_consumer_can_create_review(self):
        payload = {"booking": self.booking.pk, "rating": 5, "comment": "Excellent"}
        self.client.force_authenticate(self.consumer)
        response = self.client.post(self.list_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["rating"], 5)

    def test_provider_can_view_reviews_for_their_services(self):
        Review.objects.create(booking=self.booking, rating=4, comment="Good")
        self.client.force_authenticate(self.provider)
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["comment"], "Good")

    def test_prevent_duplicate_reviews(self):
        Review.objects.create(booking=self.booking, rating=4, comment="Good")
        payload = {"booking": self.booking.pk, "rating": 5}
        self.client.force_authenticate(self.consumer)
        response = self.client.post(self.list_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("booking", response.data)
