from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient


class LoginApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_model = get_user_model()
        self.user_model.objects.create_user(
            username="tester",
            password="pass1234",
            first_name="Test",
            last_name="User",
        )

    def test_login_success(self):
        response = self.client.post(
            "/api/auth/login",
            {"username": "tester", "password": "pass1234"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["code"], status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "success")
        self.assertTrue(response.data["data"]["token"])
        self.assertEqual(response.data["data"]["user"]["username"], "tester")

    def test_login_invalid_credentials(self):
        response = self.client.post(
            "/api/auth/login",
            {"username": "tester", "password": "bad-password"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data["code"], status.HTTP_401_UNAUTHORIZED)
