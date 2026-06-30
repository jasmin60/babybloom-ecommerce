from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt

from .models import Product, Order, OrderItem, Category, SubCategory
from .serializers import ProductSerializer, UserSerializer, OrderSerializer, SubCategorySerializer


# 🔹 PRODUCT APIs

@api_view(['GET', 'POST'])
def product_list(request):

    if request.method == 'GET':
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = ProductSerializer(data=request.data,many=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
def subcategory_list(request):
    subcategories = SubCategory.objects.all()
    serializer = SubCategorySerializer(subcategories, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def subcategory_detail(request, pk):
    try:
        subcategory = SubCategory.objects.get(id=pk)
    except SubCategory.DoesNotExist:
        return Response({"error": "SubCategory not found"}, status=404)
    serializer = SubCategorySerializer(subcategory)
    return Response(serializer.data)



@api_view(['GET', 'PUT', 'DELETE'])
def product_detail(request, pk):

    try:
        product = Product.objects.get(id=pk)
    except Product.DoesNotExist:
        return Response(
            {"error": "Product not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    if request.method == 'GET':
        serializer = ProductSerializer(product)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = ProductSerializer(product, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        product.delete()
        return Response(
            {"message": "Product deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )


# 🔹 USER API (Register)

@api_view(['POST'])
def register_user(request):
    serializer = UserSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "User created successfully"},
            status=status.HTTP_201_CREATED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 🔹 ORDER API (Protected)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):

    serializer = OrderSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(user=request.user)  # 🔥 important
        return Response(serializer.data)

    return Response(serializer.errors, status=400)

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def make_payment(request, pk):
    try:
        order = Order.objects.get(id=pk, user=request.user)
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=404)

    order.is_paid = True
    order.payment_id = "PAY123456"  # dummy payment id
    order.save()

    return Response({"message": "Payment successful"})