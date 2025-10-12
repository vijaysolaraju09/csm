from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User


class AuthFlowTests(APITestCase):
    def test_signup_login_refresh_flow(self):
        signup_url = reverse("auth-signup")
        login_url = reverse("auth-login")
        refresh_url = reverse("auth-refresh")
        me_url = reverse("auth-me")

        response = self.client.post(
            signup_url,
            {"email": "new@example.com", "name": "New", "role": User.Roles.CONSUMER, "password": "pass12345"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["email"], "new@example.com")

        response = self.client.post(login_url, {"email": "new@example.com", "password": "pass12345"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

        tokens = response.data
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {tokens['access']}")
        me_response = self.client.get(me_url)
        self.assertEqual(me_response.status_code, status.HTTP_200_OK)
        self.assertEqual(me_response.data["email"], "new@example.com")

        refresh_response = self.client.post(refresh_url, {"refresh": tokens["refresh"]}, format="json")
        self.assertEqual(refresh_response.status_code, status.HTTP_200_OK)
        self.assertIn("access", refresh_response.data)
