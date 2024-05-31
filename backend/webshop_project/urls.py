from django.urls import path
from .views import (
    SignupUserAPIView,
    LoginUserAPIView,
    ChangePasswordAPIView,
    ConfirmOrderAPIView,
    InventoryAPIView,
    ItemsAPIView,
    EditItemAPIView,
    FetchCartAPIView,
    ManageCartItemsAPIView,
    PopulateDatabaseAPIView,
)

urlpatterns = [
    path('signup-user', SignupUserAPIView.as_view(), name='signup-user'),
    path('login-user', LoginUserAPIView.as_view(), name='login-user'),
    path('change-password', ChangePasswordAPIView.as_view(), name='account'),
    path('confirm-order', ConfirmOrderAPIView.as_view(), name='confirm-order'),
    path('myitems', InventoryAPIView.as_view(), name='myitems'),
    path('items', ItemsAPIView.as_view(), name='list-items'),
    path('items/<int:pk>', EditItemAPIView.as_view(), name='edit-item'),
    path('view-cart', FetchCartAPIView.as_view(), name='view-cart'),
    path('cart-item/<int:item_id>', ManageCartItemsAPIView.as_view(), name='cart-item'),
    path('populate', PopulateDatabaseAPIView.as_view(), name='populate-database'),
]
