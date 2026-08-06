from django.db import models

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
    image_url = models.URLField(max_length=500, blank=True, null=True)

    def __str__(self):
        return f"{self.parent_category.name} > {self.name}"
        
    class Meta:
        verbose_name_plural = "SubCategories"


class Product(models.Model):
    GENDER_TAG_CHOICES = [
        ('all', 'Unisex / All'),
        ('girl', 'Girl'),
        ('boy', 'Boy'),
    ]
    
    subcategory = models.ForeignKey(SubCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    gender_tag = models.CharField(max_length=20, choices=GENDER_TAG_CHOICES, default='all')
    name = models.CharField(max_length=200)
    
    # 💰 Commercial Pricing Setup
    original_price = models.FloatField(default=0.0, help_text="The regular retail store price (M.R.P.)")
    price = models.FloatField(help_text="The active customer selling price (Offer Price)")
    
    description = models.TextField()
    
    # 🖼️ Product Media URLs
    image_url = models.URLField(max_length=500, blank=True, null=True, help_text="Paste direct web images here")
    image = models.URLField(blank=True, help_text="Fallback system path link")
    
    
    # Meta Information 
    brand = models.CharField(max_length=100, default="BabyBloom Atelier")
    color = models.CharField(max_length=50, blank=True, null=True)
    age_group = models.CharField(max_length=50, blank=True, null=True)
    stock_quantity = models.PositiveIntegerField(default=10)
    product_tags = models.CharField(max_length=250, default="Organic, New Arrival")
    
    # Reward Metrics
    active_offer_percentage = models.PositiveIntegerField(default=0)
    card_extra_discount_percentage = models.PositiveIntegerField(default=5)
    upi_cashback_reward = models.FloatField(default=50.0)
    view_count = models.PositiveIntegerField(default=0)
    is_admin_approved = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} (Stock: {self.stock_quantity})"

    # 💡 Automatically calculates the exact deal discount percentage dynamically
    @property
    def auto_discount_percent(self):
        if self.original_price > self.price and self.original_price > 0:
            return round(((self.original_price - self.price) / self.original_price) * 100)
        return 0