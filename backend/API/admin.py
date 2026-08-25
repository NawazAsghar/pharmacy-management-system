from django.contrib import admin
from .models import Item, Batch, Order, Bill,Bill_item, User, Inventory


@admin.register(User)
class UsersAdmin(admin.ModelAdmin):
    list_display = ['username', 'role']

@admin.register(Item)
class ItemstAdmin(admin.ModelAdmin):
    pass

@admin.register(Batch)
class BatchtAdmin(admin.ModelAdmin):
    pass

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id','status', 'created_at']

class BillItem_Inline(admin.TabularInline):
    model = Bill_item
    extra = 1

@admin.register(Bill)
class BillAdmin(admin.ModelAdmin):
    list_display = ['id', 'created_at']
    inlines = [BillItem_Inline]
    readonly_fields = ['created_at']

@admin.register(Inventory)
class InventoryAdmin(admin.ModelAdmin):
    pass
    

