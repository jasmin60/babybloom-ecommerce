# backend/orders/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Order, OrderItem # Make sure your models match
from products.models import Product  # Assuming you have a Product model in your products app

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    # 🚀 This function name MUST be exactly 'create_order'
    try:
        user = request.user
        data = request.data

        shipping_address = data.get('shipping_address','Default delivery address')
        items = data.get('items', [])

        if not items:
            return Response({"error": "No items provided for the order"}, status=status.HTTP_400_BAD_REQUEST)
        
        order = Order.objects.create(
            user=user,
            shipping_address=shipping_address,
            payment_method_selected=data.get('payment_method_selected', 'COD'),
            subtotal_amount=data.get('subtotal_amount'),
            shipping_charge=data.get('shipping_charge', 0.0),    
            total_amount=data.get('total_amount')
        )
        
        # Save order items
      
        for item in items:
            pro_id = item.get('product')
            qty = item.get('quantity', 1)
            prod = Product.objects.get(id=pro_id)

            OrderItem.objects.create(
                order=order,
                product=prod,
                quantity=qty,
                unit_price=prod.price
            )
            
        return Response({"message": "Order placed successfully", "order_id": order.id}, status=status.HTTP_201_CREATED)
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
            "payment_method_selected": order.payment_method_selected,
            "total_amount": str(order.total_amount),
            "order_status": order.order_status,
            "created_at": order.created_at,
            "items": [
                {
                    "product_name": item.product.name,
                    "quantity": item.quantity,
                    "unit_price": str(item.unit_price),
                    "line_total": str(item.quantity * item.unit_price)
                } for item in order.items.all()
            ]
        })
    return Response(orders_data, status=status.HTTP_200_OK)