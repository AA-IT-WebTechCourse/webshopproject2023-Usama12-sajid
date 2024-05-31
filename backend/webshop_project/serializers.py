from rest_framework import serializers
from django.contrib.auth.models import User
from django.db.models import Sum
from .models import Item, Cart

class ItemSerializer(serializers.ModelSerializer):
    seller = serializers.PrimaryKeyRelatedField(read_only=True)
    buyer = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Item
        fields = ['id', 'title', 'description', 'price', 'created_at', 'seller', 'buyer', 'status']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
    
    def create(self, validated_data):
        # Using create_user to ensure password is hashed
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),  # Use get to avoid KeyErrors if email is optional
            password=validated_data['password']
        )
        return user

class CartSerializer(serializers.ModelSerializer):
    total_price = serializers.SerializerMethodField()
    items = ItemSerializer(many=True)

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'total_price']

    def get_total_price(self, obj):
        # Calculate the total price of items in the cart
        return obj.items.aggregate(total_price=Sum('price'))['total_price'] or 0
