# backend/accounts/models.py
from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar=models.ImageField(upload_to='avatars/', blank=True, null=True)  # Optional avatar field
    # 🚀 Apply blank=True, null=True to ALL profile fields
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    place = models.CharField(max_length=100, blank=True, null=True)
    district = models.CharField(max_length=100, blank=True, null=True)
    pincode = models.CharField(max_length=10, blank=True, null=True)

    class Meta:
        app_label = 'accounts'

    def __str__(self):
        return f"Profile for {self.user.username}"