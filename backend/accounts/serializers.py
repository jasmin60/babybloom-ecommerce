# accounts/serializers.py
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # Allow payload key to be either 'username' or 'email'
        username_or_email = attrs.get("username") or attrs.get("email")

        if username_or_email:
            if "@" in username_or_email:
                try:
                    user = User.objects.get(email=username_or_email)
                    attrs["username"] = user.username
                except User.DoesNotExist:
                    pass
            else:
                attrs["username"] = username_or_email

        return super().validate(attrs)