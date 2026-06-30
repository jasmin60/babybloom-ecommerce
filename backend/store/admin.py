from django.contrib import admin
from .models import Product, Order, OrderItem, Category, SubCategory

class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

class SubCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'parent_category')
    prepopulated_fields = {'slug': ('name',)}

# 🔹 FIXED REGISTRATION: Passed the Admin management rules to the registration hooks
admin.site.register(Product)
admin.site.register(Category, CategoryAdmin)
admin.site.register(SubCategory, SubCategoryAdmin)
admin.site.register(Order)
admin.site.register(OrderItem)