from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import Item, Batch, Order,  Bill,Bill_item, User, Inventory, Order_Items

class Item_serializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'

class Batch_serializer(serializers.ModelSerializer):
    item_set = Item_serializer(many=True, read_only = True)
    class Meta:
        model = Batch
        fields = ['id', 'item_set', 'expiry_date', 'manufacture_date']

class Suppliers_serializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'phone', 'role']
        read_only_fields = ['id',]

class Pharmacist_serializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username', 'email', 'first_name', 'last_name', 'phone', 'role']
        read_only_fields = ['id',]

class Order_Item_serializer(serializers.ModelSerializer):

    class Meta:
        model = Order_Items
        fields = ['item', 'strength', 'quantity']
    
class Order_serializer(serializers.ModelSerializer):
    items = Order_Item_serializer(many=True)
    supplier = Suppliers_serializer(read_only=True)          # 👈 keep for output (GET)
    supplier_id = serializers.PrimaryKeyRelatedField(        # 👈 add for input (POST)
        queryset=User.objects.all(),
        source='supplier',
        write_only=True
    )
    class Meta:
        model = Order
        fields = ['id', 'supplier', 'supplier_id', 'status', 'created_at', 'items']

    """
    AI code
    Here we do -> Make 1 bill add many items to that bill.

    create() -> This runs after serializer.is_valid() from viewset.

    items_data = validated_data.pop('items') -> remove the items from validated_data and save it in items_data variable.
    Because the Order model dose not have an items field. Order only has supplier, status, and created_at.
    After this line:
    validated_data = {'supplier':3, 'status':'SENDED'}
    items_data = [{'item':'penadol','strength': 500, 'quantity': 4}, {...}]

    order = Order.objects.create() -> Save a new row in the Order table.
    Now 'order' vaiable has the new Order object + its new id from the DB. 
    Save bill #32 (bill id) and supplier=2.

    for item_data in items_data: -> Now loop through each item in the items list.
    in the loop Order_Items.object.create(order=order) -> create 1 Order_Item row and attach it to the Order we jsut make.
    order=order -> We till django: this item belong ot this order id.
    Save each item in the items_dat and linked to Bill #32

    return order -> give back the completed Order object to the viewset.
    The viewset will then turn it into JSON and send 201 Created back to React.

    Points:
    We can't create Order_Items without an Order id first.
    Create parent Order, get its id 
    Create children Order_Items, with that parent it.
    Thats why we pop 'items' first, then create order, then loop through each item in 'items' and add them one by one in the Order_Items model with the Order id.
    """

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        for item_data in items_data:
            Order_Items.objects.create(order=order, **item_data)
        return order

class Inventory_serializer(serializers.ModelSerializer):
    item =  Item_serializer(read_only=True)
    class Meta:
        model = Inventory
        fields = ['id', 'item', 'strength', 'quantity', 'brand']

class Bill_item_serializer(serializers.ModelSerializer):
    item = Item_serializer(read_only=True)
    item_id = serializers.PrimaryKeyRelatedField(
        queryset = Item.objects.all(),
        source = "item",
        write_only = True
    )
    class Meta:
        model = Bill_item
        fields = ['id', 'item', 'item_id', 'quantity', 'price']
        read_only_fields = ['price']

class Bill_serializer(serializers.ModelSerializer):
    items = Bill_item_serializer(many=True)
    pharmacist_name = Pharmacist_serializer(source='pharmacist',read_only=True)
    pharmacist = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Bill
        fields = ['id',  'pharmacist', 'pharmacist_name','created_at', 'totalBill_amount', 'items']
        read_only_fields = ['totalBill_amount', 'created_at']

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        bill = Bill.objects.create(**validated_data)

        totalBill = 0;
        for item_data in items_data:
            item_obj = item_data['item']
            quantity = item_data['quantity']
            line_total = item_obj.price * quantity

            Bill_item.objects.create(
                bill=bill,
                item = item_obj,
                quantity = quantity,
                price = line_total
                )

            totalBill += line_total
        bill.totalBill_amount = totalBill
        bill.save()
        return bill

class Signup_serializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ["username", "first_name", "last_name", "role","email", "phone", "password", "password2"]

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Password dosen't match")
        return data 
    
    def create(self, validated_data):
        validated_data.pop('password2')
        return User.objects.create_user(**validated_data)

class Login_serializer(serializers.Serializer):
    username = serializers.CharField(max_length=100)
    password = serializers.CharField(max_length=500)

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        if username and password:
            user = authenticate(username = username, password = password)
            if not user:
                raise serializers.ValidationError("Invalid info")
            
        data['user'] = user
        return data

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id',]