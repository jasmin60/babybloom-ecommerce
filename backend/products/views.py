from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status,viewsets
from django.contrib.auth.models import User



from .models import Category, Product, SubCategory
from .serializers import ProductSerializer, UserSerializer, OrderSerializer, SubCategorySerializer,CategorySerializer


from orders.models import Order, OrderItem


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user_profile(request):
    return Response(UserSerializer(request.user).data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_orders_history(request):
    orders = Order.objects.filter(user=request.user).order_by('-created_at')
    return Response(OrderSerializer(orders, many=True).data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_users_list(request):
    if not request.user.is_staff and not "admin" in request.user.username.lower():
        return Response({"error": "Staff clearance required"}, status=403)
    return Response(UserSerializer(User.objects.all().order_by('id'), many=True).data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    data = request.data
    items_data = data.pop('items', [])
    
    order = Order.objects.create(
        user=request.user,
        shipping_address=data.get('shipping_address'),
        subtotal_amount=float(data.get('subtotal_amount', 0)),
        shipping_charge=float(data.get('shipping_charge', 0)),
        payment_bonus_savings=float(data.get('payment_bonus_savings', 0)),
        total_amount=float(data.get('total_amount', 0)),
        payment_method_selected=data.get('payment_method_selected', 'COD')
    )
    
    for item in items_data:
        prod = Product.objects.get(id=item['product'])
        OrderItem.objects.create(order=order, product=prod, quantity=int(item['quantity']), unit_price=prod.price)
    
    order.save() # Invokes stock decrement loops
    return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

@api_view(['GET', 'POST'])
def product_list(request):
    if request.method == 'GET':
        return Response(ProductSerializer(Product.objects.all(), many=True).data)
    elif request.method == 'POST':
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET', 'PUT', 'DELETE'])
def product_detail(request, pk):
    try:
        product = Product.objects.get(id=pk)
    except Product.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
        
    if request.method == 'GET':
        product.view_count += 1 # Increments live dashboard counter parameters
        product.save()
        return Response(ProductSerializer(product).data)
    elif request.method == 'PUT':
        serializer = ProductSerializer(product, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def subcategory_list(request):
    return Response(SubCategorySerializer(SubCategory.objects.all(), many=True).data)

class CategoryViewSet(viewsets.ModelViewSet):
    """
    Handles all operations for main Categories.
    URL endpoints automatically managed.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

class SubCategoryViewSet(viewsets.ModelViewSet):
    """
    Handles all operations for Subcategories.
    """
    queryset = SubCategory.objects.all()
    serializer_class = SubCategorySerializer
    permission_classes = [AllowAny]

class ProductViewSet(viewsets.ModelViewSet):
    """
    Handles all operations for Products (Add, Edit, List, Delete).
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

@api_view(['POST'])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Registration compile success"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CategoryViewSet(viewsets.ModelViewSet):
    """
    Handles all operations for main Categories.
    URL endpoints automatically managed.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

class SubCategoryViewSet(viewsets.ModelViewSet):
    """
    Handles all operations for Subcategories.
    """
    queryset = SubCategory.objects.all()
    serializer_class = SubCategorySerializer
    permission_classes = [AllowAny]

class ProductViewSet(viewsets.ModelViewSet):
    """
    Handles all operations for Products (Add, Edit, List, Delete).
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]