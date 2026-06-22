from django.urls import path
from .views import product_list, product_detail, register_user
from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [
    path('products/', product_list),
    path('products/<int:pk>/', product_detail),

    # Auth
    path('register/', register_user),
    path('login/', TokenObtainPairView.as_view()),
]