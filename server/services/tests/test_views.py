from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User
from services.models import Service


class ServiceViewSetTests(APITestCase):
    def setUp(self):
        self.provider = User.objects.create_user(
            email="provider@example.com", name="Provider", password="pass12345", role=User.Roles.PROVIDER
        )
        self.consumer = User.objects.create_user(
            email="consumer@example.com", name="Consumer", password="pass12345", role=User.Roles.CONSUMER
        )
        self.list_url = reverse("service-list")

    def test_provider_can_create_service(self):
        payload = {
            "title": "Gardening",
            "category": "outdoor",
            "price": "50.00",
            "location": "Boston",
            "description": "Lawn mowing",
        }
        self.client.force_authenticate(self.provider)
        response = self.client.post(self.list_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["owner"]["email"], self.provider.email)

    def test_consumer_cannot_create_service(self):
        payload = {
            "title": "Gardening",
            "category": "outdoor",
            "price": "50.00",
            "location": "Boston",
            "description": "Lawn mowing",
        }
        self.client.force_authenticate(self.consumer)
        response = self.client.post(self.list_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_filtering_and_search(self):
        Service.objects.create(
            owner=self.provider,
            title="Deep Cleaning",
            category="cleaning",
            price="150.00",
            location="New York",
            description="Apartment cleaning",
        )
        Service.objects.create(
            owner=self.provider,
            title="Dog Walking",
            category="pets",
            price="25.00",
            location="Boston",
            description="Daily walks",
        )

        response = self.client.get(self.list_url, {"category": "cleaning", "price_max": "160"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "Deep Cleaning")

        search_response = self.client.get(self.list_url, {"search": "dog"})
        self.assertEqual(search_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(search_response.data), 1)
        self.assertEqual(search_response.data[0]["title"], "Dog Walking")
