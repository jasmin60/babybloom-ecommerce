# backend/orders/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Order, OrderItem # Make sure your models match

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    # 🚀 This function name MUST be exactly 'create_order'
    try:
        user = request.user
        data = request.data
        
        order = Order.objects.create(
            user=user,
            shipping_address=data.get('shipping_address'),
            payment_method_selected=data.get('payment_method_selected', 'COD'),
            subtotal_amount=data.get('subtotal_amount'),
            total_amount=data.get('total_amount')
        )
        
        # Save order items
        items = data.get('items', [])
        for item in items:
            OrderItem.objects.create(
                order=order,
                product_id=item.get('product'),
                quantity=item.get('quantity', 1)
            )
            
        return Response({"message": "Order manifested successfully", "order_id": order.id}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_orders_history(request):
    # 🚀 This function name handles your /api/orders/history/ route!
    user = request.user
    orders = Order.objects.filter(user=user).order_by('-created_at')
    
    orders_data = []
    for order in orders:
        orders_data.append({
            "id": order.id,
            "shipping_address": order.shipping_address,
            "total_amount": str(order.total_amount),
            "created_at": order.created_at
        })
    return Response(orders_data, status=status.HTTP_200_OK)