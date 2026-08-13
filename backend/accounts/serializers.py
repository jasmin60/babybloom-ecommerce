from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        username_or_email = attrs.get("username")
        password = attrs.get("password")

        if username_or_email and "@" in username_or_email:
            try:
                user = User.objects.get(email=username_or_email)
                attrs["username"] = user.username
            except User.DoesNotExist:
                pass

        return super().validate(attrs)