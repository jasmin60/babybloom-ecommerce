from django.db import models
from django.contrib.auth.models import User
# 🚀 REMOVED: from products.models import Product (To completely stop the loading crash)

class Order(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending Approval'),
        ('Processing', 'Processing'),
        ('Shipped', 'Shipped via Courier'),
        ('Delivered', 'Delivered Safely'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    created_at = models.DateTimeField(auto_now_add=True)
    is_paid = models.BooleanField(default=False)
    payment_method_selected = models.CharField(max_length=50, default="COD")
    subtotal_amount = models.FloatField(default=0.0)
    shipping_charge = models.FloatField(default=0.0)
    payment_bonus_savings = models.FloatField(default=0.0)
    total_amount = models.FloatField(default=0.0)
    order_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    shipping_address = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Order #{self.id} For {self.user.username}"

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        
        if is_new or self.payment_method_selected == "COD" or self.is_paid:
            for item in self.items.all():
                prod = item.product
                if prod.stock_quantity >= item.quantity:
                    prod.stock_quantity -= item.quantity
                    prod.save()

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    
    # 🚀 FIXED: Pointing to 'products.Product' as a string reference instead of the explicit class object
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE)
    
    quantity = models.PositiveIntegerField()
    unit_price = models.FloatField()