from django.urls import path
from .views import product_list, product_detail, create_order, register_user, subcategory_list, current_user_profile, user_orders_history, admin_users_list
from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [
    path('products/', product_list),
    path('products/<int:pk>/', product_detail),
    path('subcategories/', subcategory_list),
    path('orders/', create_order),
    path('orders/history/', user_orders_history),
    path('profile/', current_user_profile),
    path('register/', register_user),
    path('users/', admin_users_list),   
    path('login/', TokenObtainPairView.as_view()),
]