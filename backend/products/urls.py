# backend/products/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Import your views
from .views import CategoryViewSet, SubCategoryViewSet, ProductViewSet, subcategory_list
from accounts.views import register_user, get_user_profile  # 🚀 FIXED: Changed to get_user_profile
from orders.views import create_order, user_orders_history      

# Initialize the automated router grid
router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'subcategories', SubCategoryViewSet, basename='subcategory')
router.register(r'products', ProductViewSet, basename='product')

urlpatterns = [
    # 1. Router Viewsets: Automatically maps 'products/', 'categories/', 'subcategories/'
    path('', include(router.urls)),
    
    # 2. Manual Endpoints: No explicit 'api/' prefix needed here because it's handled at root!
    path('subcategories-list/', subcategory_list),
    path('orders/', create_order),
    path('orders/history/', user_orders_history),
    
    # 3. Authentication Handshakes
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', register_user),
    path('profile/', get_user_profile), # 🚀 FIXED: Changed to get_user_profile
]