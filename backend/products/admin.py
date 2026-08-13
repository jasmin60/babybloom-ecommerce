from django.contrib import admin
from .models import Category, SubCategory, Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    # Displays clean row data columns in your admin summary grid table list
    list_display = ('name', 'original_price', 'discounted_price',  'stock_quantity', 'subcategory')
    
    # Filter panels matching your exact product fields
    list_filter = ('gender_tag', 'subcategory', 'brand')
    
    search_fields = ('name', 'description', 'brand')
    
    # 🚀 Cleaned up form layouts matching ONLY fields present on your Product model
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'gender_tag', 'brand', 'color', 'age_group', 'product_tags')
        }),
        ('Pricing & Active Discounts', {
            'fields': ('original_price', 'price'),
            'description': 'Type your M.R.P. in original price, and your lower sales deal value in price.'
        }),
        ('Stock & Relations', {
            'fields': ('stock_quantity', 'subcategory', 'is_admin_approved')
        }),
        ('Product Media Assets', {
            'fields': ('image_url', 'image')
        }),
    )

    def get_discount(self, obj):
        # Calls your new auto_discount_percent model calculation helper safely
        return f"{obj.auto_discount_percent}% OFF" if obj.auto_discount_percent > 0 else "No Discount"
    get_discount.short_description = 'Active Deal'

# Register the remaining tables smoothly
admin.site.register(Category)
admin.site.register(SubCategory)