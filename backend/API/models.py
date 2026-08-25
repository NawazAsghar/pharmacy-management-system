from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    role_choices = [
        ('PHARMACIST', 'Pharmacist'),
        ('SUPPLIER', 'Supplier')
    ] 
    role = models.CharField(choices=role_choices)
    phone = models.CharField(max_length=20)
    # address = models.CharField(max_length=50)

    def __str__(self):
        return self.username

class Item(models.Model):

    Medicine_form = [
        ("TABLET", 'Tablet'),
        ("ENJACTION", 'Enjection'),
        ("SYRUP", 'Syrup'),
    ]

    name = models.CharField(max_length=100)
    scientific_name = models.CharField(max_length=100, null=True, blank=True)
    brand = models.CharField(max_length=100, null=True, blank=True)
    strength = models.IntegerField(null=True, blank=True)
    price = models.IntegerField(null=True, blank=True)
    form = models.CharField(max_length=50, choices=Medicine_form, null=True, blank=True)
    batch = models.ForeignKey("API.Batch", on_delete=models.DO_NOTHING, null=True, blank=True)
    
    def __str__(self):
        return self.name

# Batch should be only set by suppliers with the order medison/item
class Batch(models.Model):
    batch_no = models.IntegerField()
    manufacture_date = models.DateField()
    expiry_date = models.DateField()
    batch_quantity = models.IntegerField()
    purchase_price = models.IntegerField()


# Insted of 'Inventory' model if we do like:
# grab all the present item which are not sold after 'Stock_order'
# For that we need to get the names of the products and the count from the Stock_order
# We have to current += stock_quantity the current oreder quantity with the already exixted quantity
# class Inventory(models.Model):
#     item = models.ForeignKey("API.Item", on_delete=models.CASCADE)
#     total_quantity = models.IntegerField()

class Order(models.Model):
    supplier = models.ForeignKey("API.USER", on_delete=models.CASCADE)
    STATUS_CHOICES = [
        ("SENDED", 'Sended'),
        ("PACKING", 'Packing'),
        ("DELIVERED", 'Delivered'),
        ("RECEIVED", 'Received'),
    ]
    # Show the received orders in the purhcases section
    status = models.CharField(choices=STATUS_CHOICES)
    created_at = models.DateField(auto_now_add=True)

class Order_Items(models.Model):
    order = models.ForeignKey("API.Order", related_name="items", on_delete=models.CASCADE)
    item = models.CharField(max_length=250)
    strength = models.IntegerField()
    quantity = models.IntegerField()



# At the frontend we will have a from where we will add item and then that item will show it the upper list then add we can add more item from this page. and we will have a A submit btn for the upper bill list and when we click on that the items price will automatically calculate 

# Bill can be only created by Pharmacist
class Bill(models.Model):
    pharmacist = models.ForeignKey("API.User", on_delete=models.CASCADE)
    # items = models.ManyToManyField("API.Item", through='Bill_item')
    created_at = models.DateTimeField(auto_now_add=True)
    totalBill_amount = models.IntegerField(default=0, editable=False)

        
class Bill_item(models.Model):
    bill = models.ForeignKey("API.Bill", on_delete=models.PROTECT,related_name='items')
    item = models.ForeignKey("API.Item", on_delete=models.PROTECT, related_name='in_bills')
    quantity = models.IntegerField()
    price = models.IntegerField() 

    def update_price(self):
        self.price = self.price * self.quantity
        self.save(update_fields=['price'])

class Inventory(models.Model):
    item = models.ForeignKey("API.Item",  on_delete=models.PROTECT)
    strength = models.IntegerField(null=True, blank=True)
    quantity = models.IntegerField(default=0)
    brand = models.CharField(max_length=50, null=True, blank=True)

    class Meta:
        unique_together = ('item', 'strength')

from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=Bill)
def update_pharmacist(sender, instance, created, **kwargs):
    if created:
        pharmacist = instance.pharmacist
        # pharmacist.total_bill += 1 #add the total bill filed in pharmacist
        pharmacist.save()