from django.db import models
from django.contrib.auth.models import User
from products.models import Product


# ============================================================
# COUPON
# ============================================================

class Coupon(models.Model):

    code = models.CharField(
        max_length=20,
        unique=True
    )

    discount_percentage = models.PositiveIntegerField()

    min_order_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    active = models.BooleanField(
        default=True
    )

    valid_until = models.DateTimeField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.code

    @property
    def is_valid(self):
        """
        Returns True if the coupon is currently active
        and has not expired.
        """

        from django.utils import timezone

        return (
            self.active
            and self.valid_until >= timezone.now()
        )


# ============================================================
# ORDER
# ============================================================

class Order(models.Model):

    STATUS_CHOICES = [
        ("PENDING", "Pending Approval"),
        ("CONFIRMED", "Order Confirmed"),
        ("PROCESSING", "Processing"),
        ("PACKED", "Packed"),
        ("SHIPPED", "Shipped"),
        ("OUT_FOR_DELIVERY", "Out for Delivery"),
        ("DELIVERED", "Delivered"),
        ("CANCELLED", "Cancelled"),
    ]

    PAYMENT_METHOD_CHOICES = [
        ("COD", "Cash on Delivery"),
        ("UPI", "UPI"),
        ("CARD", "Card"),
        ("NET_BANKING", "Net Banking"),
    ]

    # --------------------------------------------------------
    # USER
    # --------------------------------------------------------

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="orders"
    )

    # --------------------------------------------------------
    # ORDER INFORMATION
    # --------------------------------------------------------

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    order_status = models.CharField(
        max_length=25,
        choices=STATUS_CHOICES,
        default="PENDING"
    )

    # --------------------------------------------------------
    # SHIPPING
    # --------------------------------------------------------

    shipping_address = models.TextField()

    shipping_charge = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    # --------------------------------------------------------
    # PAYMENT
    # --------------------------------------------------------

    payment_method_selected = models.CharField(
        max_length=50,
        choices=PAYMENT_METHOD_CHOICES,
        default="COD"
    )

    is_paid = models.BooleanField(
        default=False
    )

    # --------------------------------------------------------
    # COUPON
    # --------------------------------------------------------

    applied_coupon = models.ForeignKey(
        "Coupon",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="orders"
    )

    # --------------------------------------------------------
    # PRICE CALCULATION
    # --------------------------------------------------------

    subtotal_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    discount_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    payment_bonus_savings = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    total_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    def __str__(self):
        return f"Order #{self.id} - {self.user.username}"


# ============================================================
# ORDER ITEM
# ============================================================

class OrderItem(models.Model):

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items"
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        related_name="order_items"
    )

    quantity = models.PositiveIntegerField(
        default=1
    )

    # IMPORTANT:
    # Store the price at the time of purchase.
    unit_price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    def __str__(self):
        return f"{self.product.name} × {self.quantity}"

    @property
    def item_total(self):
        return self.unit_price * self.quantity