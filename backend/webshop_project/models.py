from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Item(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='items')
    status = models.IntegerField(default=1)
    buyer = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='purchases')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    items = models.ManyToManyField(Item)

    def __str__(self):
        return f"Cart of: {self.user.username}"