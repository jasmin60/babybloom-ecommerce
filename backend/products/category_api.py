from rest_framework import serializers, viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from .models import Category  # Mapped to your core Category model

# 1. Clean Category Serializer
class MainCategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'icon', 'product_count']

    def get_product_count(self, obj):
        total=0
        # Counts products attached directly to this category or via its subcategories
        if hasattr(obj, 'subcategories'):
            for sub in obj.subcategories.all():
                total += sub.products.count()   
           
        return total + obj.products.count()  # Add products directly under this category
# 2. Public API View to list Main Categories
@api_view(['GET'])
@permission_classes([AllowAny])
def list_main_categories(request):
    categories = Category.objects.all()
    serializer = MainCategorySerializer(categories, many=True)
    return Response(serializer.data)