from django.db import models
from django.contrib.auth.models import User

class Cart(models.Model):
    # Ties an active shopping basket directly to a registered user account
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='cart_session')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Active Workspace Basket - {self.user.username}"
        
    @property
    def total_basket_cost(self):
        return sum(item.line_total for item in self.items.all())


class CartItem(models.Model):
    # Links back to the master Cart parent container
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    
    # 🚀 STRING DECOUPLING: Safe literal avoids app loading sequence loop crashes
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE)
    
    # Quantitative tracking metrics
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity}x {self.product.name} inside {self.cart.user.username}'s Bag"

    @property
    def line_total(self):
        return self.quantity * self.product.price
