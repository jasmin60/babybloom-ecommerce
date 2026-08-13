from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator


# ============================================================
# CATEGORY
# ============================================================

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True,null=True,blank=True)
    image_url = models.URLField(max_length=500, blank=True, null=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


# ============================================================
# SUBCATEGORY
# ============================================================

class SubCategory(models.Model):
    parent_category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="subcategories"
    )
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True,null=True,blank=True)
    image_url = models.URLField(max_length=500, blank=True, null=True)

    class Meta:
        verbose_name_plural = "SubCategories"

    def __str__(self):
        return f"{self.parent_category.name} > {self.name}"


# ============================================================
# PRODUCT
# ============================================================

class Product(models.Model):

    GENDER_TAG_CHOICES = [
        ("all", "Unisex / All"),
        ("girl", "Girl"),
        ("boy", "Boy"),
    ]

    # --------------------------------------------------------
    # BASIC PRODUCT INFORMATION
    # --------------------------------------------------------

    subcategory = models.ForeignKey(
        SubCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="products"
    )

    name = models.CharField(max_length=255)

    slug = models.SlugField(
        max_length=255,
        unique=True,null=True,blank=True
    )

    description = models.TextField()

    # --------------------------------------------------------
    # PRICING
    # --------------------------------------------------------

    original_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Regular retail price / MRP"
    )

    discounted_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Current customer selling price"
    )

    # --------------------------------------------------------
    # PRODUCT META INFORMATION
    # --------------------------------------------------------

    brand = models.CharField(
        max_length=100,
        default="BabyBloom Atelier"
    )

    gender_tag = models.CharField(
        max_length=20,
        choices=GENDER_TAG_CHOICES,
        default="all"
    )

    color = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )

    age_group = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )

    product_tags = models.CharField(
        max_length=250,
        default="Organic, New Arrival"
    )

    # --------------------------------------------------------
    # STOCK
    # --------------------------------------------------------

    stock_quantity = models.PositiveIntegerField(default=10)

    # --------------------------------------------------------
    # PRODUCT STATUS
    # --------------------------------------------------------

    is_admin_approved = models.BooleanField(default=True)

    is_trending = models.BooleanField(default=False)

    is_flash_sale = models.BooleanField(default=False)

    # --------------------------------------------------------
    # OFFER / REWARD SYSTEM
    # --------------------------------------------------------

    active_offer_percentage = models.PositiveIntegerField(
        default=0
    )

    card_extra_discount_percentage = models.PositiveIntegerField(
        default=5
    )

    upi_cashback_reward = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=50.00
    )

    # --------------------------------------------------------
    # ANALYTICS
    # --------------------------------------------------------

    views_count = models.PositiveIntegerField(
        default=0
    )

    purchases_count = models.PositiveIntegerField(
        default=0
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    # --------------------------------------------------------
    # IMAGE
    # --------------------------------------------------------

    image_url = models.URLField(
        max_length=500,
        blank=True,
        null=True,
        help_text="Main product image URL"
    )

    # --------------------------------------------------------
    # CALCULATED PROPERTIES
    # --------------------------------------------------------

    @property
    def discount_percentage(self):
        """
        Automatically calculates the discount percentage.
        """

        if (
            self.original_price
            and self.original_price > self.discounted_price
        ):
            discount = (
                (self.original_price - self.discounted_price)
                / self.original_price
            ) * 100

            return int(round(discount))

        return 0

    @property
    def auto_discount_percent(self):
        """
        Backward-compatible alias for the old property.
        """

        return self.discount_percentage

    @property
    def popularity_score(self):
        """
        Product popularity calculation.

        Purchases have the highest weight,
        followed by reviews and views.
        """

        return (
            (self.purchases_count * 5)
            + (self.views_count * 1)
            + (self.reviews.count() * 2)
        )

    def __str__(self):
        return f"{self.name} (Stock: {self.stock_quantity})"


# ============================================================
# PRODUCT IMAGES
# ============================================================

class ProductImage(models.Model):

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="images"
    )

    image_url = models.URLField(
        max_length=500
    )

    def __str__(self):
        return f"Image - {self.product.name}"


# ============================================================
# PRODUCT REVIEWS
# ============================================================

class ProductReview(models.Model):

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="reviews"
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    rating = models.PositiveIntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(5)
        ]
    )

    comment = models.TextField()

    is_verified_purchase = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.product.name} - {self.rating}/5"


# ============================================================
# WISHLIST
# ============================================================

class Wishlist(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="wishlist"
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE
    )

    added_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "product"],
                name="unique_user_product_wishlist"
            )
        ]

    def __str__(self):
        return f"{self.user.username} - {self.product.name}"