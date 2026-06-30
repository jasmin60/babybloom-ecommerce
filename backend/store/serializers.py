from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Product, Order, OrderItem, Category, SubCategory

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']

class SubCategorySerializer(serializers.ModelSerializer):
    parent_category_name = serializers.CharField(source='parent_category.name', read_only=True)

    class Meta:
        model = SubCategory
        fields = ['id', 'name', 'slug', 'parent_category', 'parent_category_name']
        
class ProductSerializer(serializers.ModelSerializer):
    subcategory_name = serializers.CharField(source='subcategory.name', read_only=True)
    # 🔥 FIXED CORRUPTION: Navigate up the chain through the subcategory relation to fetch parent category details
    category_name = serializers.CharField(source='subcategory.parent_category.name', read_only=True)
    category_id = serializers.IntegerField(source='subcategory.parent_category.id', read_only=True)
    gender_tag_display = serializers.CharField(source='get_gender_tag_display', read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'subcategory', 'subcategory_name', 'category_id', 'category_name', 
            'gender_tag', 'gender_tag_display', 'name', 'price', 'description', 
            'image', 'brand', 'color', 'age_group', 'stock_quantity'
        ]

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_price = serializers.FloatField(source='product.price', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'product_price', 'quantity', 'unit_price']
        read_only_fields = ['unit_price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    user_username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'user_username', 'items', 'created_at', 'total_amount', 'order_status', 'shipping_address', 'is_paid']
        read_only_fields = ['user', 'created_at', 'total_amount', 'order_status', 'is_paid']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        calculated_total = 0.0
        
        for item in items_data:
            target_product = item['product']
            item_qty = item['quantity']
            current_price = target_product.price
            calculated_total += (current_price * item_qty)
            
            OrderItem.objects.create(
                order=order,
                product=target_product,
                quantity=item_qty,
                unit_price=current_price
            )
            
        order.total_amount = calculated_total
        order.save()
        return order