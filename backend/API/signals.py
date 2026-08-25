from django.db.models.signals import pre_save
from django.dispatch import receiver
from .models import Order, Inventory, Item
from django.db import transaction

@receiver(pre_save, sender=Order)
def updateInventory(sender, instance, **kwargs):

    if not instance.pk:
        return

    old_instance = sender.objects.get(pk=instance.pk)
    if old_instance.status != instance.status and instance.status=='RECEIVED':

        all_bill_items = instance.items.all()
        with transaction.atomic():
            for bi in all_bill_items:
                item_obj, _ = Item.objects.get_or_create(
                    name=bi.item,
                    strength=bi.strength)

                inventory_item, created = Inventory.objects.get_or_create(
                    item = item_obj, strength = bi.strength, brand = bi.brand,  defaults={'quantity':0}
                    )

                inventory_item.quantity += bi.quantity
                inventory_item.save()

                action = "Created" if created else "Updated"
                print(f" -> {action}")