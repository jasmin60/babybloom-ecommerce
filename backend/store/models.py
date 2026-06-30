from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"

class SubCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True, null=True)
    parent_category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='subcategories')

    def __str__(self):
        return f"{self.parent_category.name} > {self.name}"

    class Meta:
        verbose_name_plural = "SubCategories"


class Product(models.Model):
    GENDER_TAG_CHOICES = [
        ('all', 'Unisex / All'),
        ('girl', 'Girl'),
        ('boy', 'Boy'),
        ('baby_boy', 'Baby Boy'),
        ('baby_girl', 'Baby Girl'),
    ]
    subcategory = models.ForeignKey(SubCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    # category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    gender_tag = models.CharField(max_length=20, choices=GENDER_TAG_CHOICES, default='all')
    name = models.CharField(max_length=200)
    price = models.FloatField()
    description = models.TextField()
    image = models.URLField(blank=True)
    
    # 🔹 New Attributes added from the ER Diagram
    brand = models.CharField(max_length=100, blank=True, null=True)
    color = models.CharField(max_length=50, blank=True, null=True)
    age_group = models.CharField(max_length=50, blank=True, null=True)
    stock_quantity = models.PositiveIntegerField(default=10)

    def __str__(self):
        return f"[{self.get_gender_tag_display()}] {self.name}"


class Order(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Processing', 'Processing'),
        ('Shipped', 'Shipped'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    is_paid = models.BooleanField(default=False)
    payment_id = models.CharField(max_length=100, blank=True, null=True)
    
    # 🔹 New financial and status fields from ER Diagram
    total_amount = models.FloatField(default=0.0)
    order_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    shipping_address = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Order {self.id} by {self.user.username}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    unit_price = models.FloatField() # 🔹 Track historical price from ER diagram

    def __str__(self):
        return f"{self.quantity} x {self.product.name} (Order #{self.order.id})"