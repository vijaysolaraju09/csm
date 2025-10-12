# Generated manually for review model.
from __future__ import annotations

from django.db import migrations, models
import django.core.validators


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("bookings", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Review",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                (
                    "rating",
                    models.PositiveSmallIntegerField(
                        validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(5)]
                    ),
                ),
                ("comment", models.TextField(blank=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "booking",
                    models.OneToOneField(
                        on_delete=models.CASCADE,
                        related_name="review",
                        to="bookings.booking",
                    ),
                ),
            ],
            options={"ordering": ["-created_at"]},
        ),
    ]
