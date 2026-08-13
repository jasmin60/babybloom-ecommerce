# products/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import CategoryViewSet, SubCategoryViewSet, ProductViewSet, subcategory_list
from accounts.views import register_user, get_user_profile, CustomTokenObtainPairView  # 👈 Import custom view
from orders.views import create_order, user_orders_history      

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'subcategories', SubCategoryViewSet, basename='subcategory')
router.register(r'products', ProductViewSet, basename='product')

urlpatterns = [
    path('', include(router.urls)),
    path('subcategories-list/', subcategory_list),
    path('orders/', create_order),
    path('orders/history/', user_orders_history),
    
    # Authentication Endpoints
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'), # 👈 Use Custom View
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', register_user),
    path('profile/', get_user_profile),
]