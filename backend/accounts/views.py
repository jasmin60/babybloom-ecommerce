from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer
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


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    print("DEBUG - Incoming Login Data:", request.data)  # Prints in your Gunicorn terminal
    # ... your login logic ...

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    try:
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        profile_data = request.data.get('profile', {})

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)

        # Create core user row instance
        user = User.objects.create_user(username=username, email=email, password=password)
        
        # Save custom user parameters if you have a linked profile model table setup
        if hasattr(user, 'profile'):
            profile = user.profile
            profile.phone_number = profile_data.get('phone_number', '')
            profile.place = profile_data.get('place', '')
            profile.district = profile_data.get('district', '')
            profile.pincode = profile_data.get('pincode', '')
            profile.save()

        return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    user = request.user
    profile_data = {}
    
    if hasattr(user, 'profile'):
        profile_data = {
            "phone_number": user.profile.phone_number,
            "place": user.profile.place,
            "district": user.profile.district,
            "pincode": user.profile.pincode,
        }
        
    return Response({
        "username": user.username,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "profile": profile_data
    })
