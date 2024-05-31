from django.contrib.auth import authenticate, login
from django.shortcuts import get_object_or_404
from django.core.management import call_command
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from django.db import transaction
from django.db.models import Q, Sum
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import AccessToken
from .models import Item, Cart
from .serializers import ItemSerializer, CartSerializer, UserSerializer

class PopulateDatabaseAPIView(APIView):
    def post(self, request):
        try:
            call_command('populate_database')
            return JsonResponse({'message': 'Database populated successfully'})
        except Exception as e:
            return Response({'message': f'Error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ItemsAPIView(generics.ListCreateAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def post(self, request, *args, **kwargs):
        user = request.user
        data = request.data
        Item.objects.create(
            title=data["title"],
            description=data["description"],
            price=data["price"],
            seller=user
        )
        return Response({'message': 'Item created successfully'}, status=status.HTTP_201_CREATED)

    def get_queryset(self):
        queryset = super().get_queryset()
        title_filter = self.request.query_params.get('title', None)
        if title_filter:
            queryset = queryset.filter(title__icontains=title_filter)
        return queryset.filter(status=1)

class EditItemAPIView(generics.UpdateAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        instance = get_object_or_404(Item, id=pk)
        user = request.user
        if instance.seller == user and instance.status == 1:
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)
        else:
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

class InventoryAPIView(generics.ListAPIView):
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Item.objects.filter(Q(seller=user) | Q(buyer=user))

class ManageCartItemsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, item_id):
        user = request.user
        item = get_object_or_404(Item, id=item_id)

        if item.seller == user:
            return Response({"message": "You cannot add your own item to cart."}, status=status.HTTP_403_FORBIDDEN)
        
        if item.status == 0:
            return Response({"message": "This item is not available."}, status=status.HTTP_403_FORBIDDEN)

        cart_item, created = Cart.objects.get_or_create(user=user)
        
        if not created:
            if item in cart_item.items.all():
                return Response({"message": "Item already in the cart."}, status=status.HTTP_200_OK)
            
        cart_item.items.add(item)
        serializer = CartSerializer(cart_item)
        return Response({"message": "Item added to cart successfully."}, status=status.HTTP_201_CREATED)
    
    def delete(self, request, item_id):
        user = request.user
        item = get_object_or_404(Item, id=item_id)

        cart_item = Cart.objects.filter(user=user).first()
        if not cart_item or item not in cart_item.items.all():
            return Response({"error": "Item not found in the cart."}, status=status.HTTP_404_NOT_FOUND)
        
        cart_item.items.remove(item)
        return Response({"message": "Item removed from cart successfully."}, status=status.HTTP_200_OK)

class FetchCartAPIView(generics.RetrieveAPIView):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user
        obj, created = Cart.objects.get_or_create(user=user)
        return obj
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['total_price'] = self.get_object().items.aggregate(total_price=Sum('price'))['total_price'] or 0
        return context

class ConfirmOrderAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        with transaction.atomic():
            cart = Cart.objects.filter(user=user).first()

            for cart_item in cart.items.all():
                cart_item.status = 0
                cart_item.buyer = user
                cart_item.save()

            cart.delete()

        return Response({'message': 'Order confirmed'}, status=status.HTTP_200_OK)

class SignupUserAPIView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({'message': 'Signup successful'}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginUserAPIView(APIView): 
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            access_token = AccessToken.for_user(user)
            return Response({
                'access_token': str(access_token),
                'user_id': user.id,
                'message': 'Login successful'
            })
        else:
            return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class ChangePasswordAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        
        if not user.check_password(old_password):
            return Response({'message': 'Old password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)
        
        user.set_password(new_password)
        user.save()
        
        return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)