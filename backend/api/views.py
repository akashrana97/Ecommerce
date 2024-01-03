# Django Import
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework import status

# Rest Framework Import
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

# Rest Framework JWT
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

# Local Import
from api.models import *
from api.serializers import *
from .models import *

# JWT Views
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        serializer = UserSerializerWithToken(self.user).data

        for k, v in serializer.items():
            data[k] = v

        return data

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['message'] = "Hello Proshop"
        # ...

        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer



# Get all the products with query
@api_view(['GET'])
def getProducts(request):
    query = request.query_params.get('keyword')
    if query == None:
        query = ''

    access_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxODc2OTM1Nzg1LCJpYXQiOjE3MDQxMzU3ODUsImp0aSI6ImM0ZWQyY2UwZTZjMTRiZTg5MmI5ZmRmMzA5Y2VmMTYzIiwidXNlcl9pZCI6MX0.wE2SZOETpUCJBtfbudX1Ik1nYc34uP-vuDzdd_UVvEE'
    products = Product.objects.filter(name__icontains=query).order_by('-_id')
    serializer = ProductSerializer(products, many=True, context={'request': request})
    return Response({'products': serializer.data, 'access_token':access_token})

# Get single products
@api_view(['GET'])
def getProduct(request, pk):
    product = Product.objects.get(_id=pk)
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)