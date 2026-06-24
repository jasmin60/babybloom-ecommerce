from django.urls import path
from .views import make_payment, product_list, product_detail, create_order, register_user
from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [
    path('products/', product_list),
    path('products/<int:pk>/', product_detail),
    path('orders/', create_order),
    path('orders/<int:pk>/', create_order),  # For retrieving a specific order by ID
    path('orders/<int:pk>/pay/', make_payment),  # For making payment for a specific order

    # Auth
    path('register/', register_user),
    path('login/', TokenObtainPairView.as_view()),
]