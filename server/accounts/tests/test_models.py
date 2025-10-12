from django.test import TestCase

from accounts.models import User


class UserModelTests(TestCase):
    def test_create_user_with_email(self):
        user = User.objects.create_user(email="user@example.com", name="User", password="password123")
        self.assertEqual(user.email, "user@example.com")
        self.assertTrue(user.check_password("password123"))
        self.assertFalse(user.is_staff)

    def test_create_superuser(self):
        admin = User.objects.create_superuser(email="admin@example.com", name="Admin", password="password123")
        self.assertTrue(admin.is_staff)
        self.assertTrue(admin.is_superuser)

    def test_missing_email_raises_error(self):
        with self.assertRaisesMessage(ValueError, "The email address must be provided"):
            User.objects.create_user(email="", name="NoEmail", password="password123")
