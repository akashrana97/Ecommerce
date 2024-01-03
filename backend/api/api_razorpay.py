from rest_framework.views import APIView
from rest_framework import status

from .models import Order, OrderItem, Product, ShippingAddress
from .razorpay_serializers import CreateOrderSerializer, TranscationModelSerializer
from rest_framework.response import Response
from .razorpay.main import RazorpayClient
import datetime
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated

rz_client = RazorpayClient()


class CreateOrderAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        '''
        {'products': [{'id': 5, 'name': 'Appolo Tyre', 'qty': 1, 'price': '25000.00', 'image': 'http://127.0.0.1:8000/media/images/tyre.jpg'}, {'id': 4, 'name': 'Battery',
 'qty': 2, 'price': '20.00', 'image': 'http://127.0.0.1:8000/media/images/battery.jpg'}, {'id': 3, 'name': 'Mobile', 'qty': 1, 'price': '60000.00', 'image': 'http:
//127.0.0.1:8000/media/images/mobile.jpg'}], 'shipment_address': 'Test', 'billing_address': 'Test', 'orderTotal': ''}

'''
        products = request.data.get('products', None)
        billing_address = request.data.get('billing_address', None)
        shipment_address = request.data.get('shipment_address', None)
        total_amount = 0

        taxPrice = 1.015
        order_obj = Order.objects.create(taxPrice=taxPrice, createdAt=datetime.datetime.now())

        if products:
            for row in products:
                price = row['price']
                qty = row['qty']
                amount = float(price) * int(qty)
                total_amount += amount

                product_obj = Product.objects.get(_id=int(row['id']))
                OrderItem.objects.create(product=product_obj, order=order_obj, qty=qty, price=price)

        order_obj.shippingPrice = int(total_amount)
        total_amount = total_amount * taxPrice
        order_obj.totalPrice = int(total_amount)
        order_obj.save()

        ShippingAddress.objects.create(
            order=order_obj,
            shipping_address=shipment_address,
            billing_address=billing_address
        )

        try:
            order_response = rz_client.create_order(
                amount=int(total_amount),
                currency="INR",
            )
            response = {
                "status_code": status.HTTP_201_CREATED,
                "message": "Order Created",
                "data": order_response,
                "amount": int(total_amount)
            }
            order_obj.order_id = order_response['id']
            order_obj.order_created = True
            order_obj.save()

            return Response(response, status=status.HTTP_201_CREATED)
        except Exception as e:
            response = {
                "status_code": status.HTTP_400_BAD_REQUEST,
                "message": "Bad Request",
                "error": str(e)
            }

            return Response(response, status=status.HTTP_400_BAD_REQUEST)


class TransactionAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        transaction_serializer = TranscationModelSerializer(data=request.data)

        if transaction_serializer.is_valid():
            order_id = transaction_serializer.validated_data.get("order_id")
            rz_client.verify_payment_signature(
                razorpay_payment_id=transaction_serializer.validated_data.get("payment_id"),
                razorpay_order_id=order_id,
                razorpay_signature=transaction_serializer.validated_data.get("signature")
            )

            obj  = Order.objects.filter(order_id=order_id)
            print(obj)
            obj.update(isPaid=True, paidAt=datetime.datetime.now())
            transaction_serializer.save()
            response = {
                "status_code": status.HTTP_201_CREATED,
                "message": "transaction created"
            }
            return Response(response, status=status.HTTP_201_CREATED)
        else:
            print(transaction_serializer.errors,"--------------")
            response = {
                "status_code": status.HTTP_400_BAD_REQUEST,
                "message": "bad request",
                "error": transaction_serializer.errors
            }
            return Response(response, status=status.HTTP_400_BAD_REQUEST)
