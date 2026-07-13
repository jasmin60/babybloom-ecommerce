from rest_framework import serializers
from django.contrib.auth.models import User
from accounts.models import UserProfile
from .models import Product, SubCategory, Category
from products.models import Product, SubCategory, Category
from orders.models import Order, OrderItem

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['phone_number', 'district', 'place', 'pincode']

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'profile']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        profile_data = validated_data.pop('profile', {})
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        
        profile, _ = UserProfile.objects.get_or_create(user=user)
        profile.phone_number = profile_data.get('phone_number')
        profile.district = profile_data.get('district')
        profile.place = profile_data.get('place')
        profile.pincode = profile_data.get('pincode')
        profile.save()
        return user
    
class CategorySerializer(serializers.ModelSerializer):
    icon = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'icon']

    def get_icon(self, obj):
        # This safely assigns a default emoji to each category card automatically
        return "🍼"

class SubCategorySerializer(serializers.ModelSerializer):
    # Shows the parent category object details on read
    category_detail = CategorySerializer(source='parent_category', read_only=True)
    
    class Meta:
        model = SubCategory
        fields = ['id', 'name', 'slug', 'parent_category', 'category_detail']

from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.SerializerMethodField()
    subcategory_name = serializers.SerializerMethodField()
    # 🚀 Add your model's calculated discount property right into the field loop
    discount_percentage = serializers.ReadOnlyField(source='auto_discount_percent')

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'original_price', 'price', 'stock_quantity', 
            'gender_tag', 'subcategory', 'category_name', 'subcategory_name', 
            'description', 'image_url', 'image', 'brand', 'color', 
            'age_group', 'product_tags', 'discount_percentage'
        ]

    def get_category_name(self, obj):
        # Safely checks nested fields to prevent NoneType attribute errors
        if obj.subcategory and obj.subcategory.parent_category:
            return obj.subcategory.parent_category.name
        return "Uncategorized"

    def get_subcategory_name(self, obj):
        return obj.subcategory.name if obj.subcategory else "None"

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_price = serializers.CharField(source='product.price', read_only=True)
    product_image = serializers.CharField(source='product.image', read_only=True)
    product_description = serializers.CharField(source='product.description', read_only=True)
    class Meta:
        model = OrderItem
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    class Meta:
        model = Order
        fields = '__all__'