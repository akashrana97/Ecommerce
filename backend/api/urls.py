from django.urls import path
from . import views
from .api_razorpay import CreateOrderAPIView,TransactionAPIView

urlpatterns = [
    path('login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('products/', views.getProducts, name="products"),
    path('product/<str:pk>/', views.getProducts, name="product"),

    path('order/create/', CreateOrderAPIView.as_view(), name="create-order-api"),
    path('order/complete/', TransactionAPIView.as_view(), name="complete-order-api"),

]
