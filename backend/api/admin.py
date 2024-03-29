from django.contrib import admin
from .models import *
# Register your models here.
admin.site.register(Product)
admin.site.register(OrderItem)
admin.site.register(ShippingAddress)
admin.site.register(Transaction)

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        "user","createdAt","totalPrice"
    ]