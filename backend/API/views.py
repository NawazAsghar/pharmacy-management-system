from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import  viewsets, status
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import Item_serializer, Batch_serializer, Inventory_serializer, Order_serializer, Bill_serializer, Suppliers_serializer, Pharmacist_serializer, ProfileSerializer

from .models import Item, Batch,  Order, Bill, User, Inventory

from .permissions import IsPharmacist, IsSupplier
from rest_framework.permissions import IsAuthenticated, IsAdminUser

class Items_viewset(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = Item_serializer
    permission_classes = [IsAuthenticated]

from django.utils import timezone
from datetime import timedelta
class Batch_viewset(viewsets.ModelViewSet):
    def get_queryset(self):
        today = timezone.now().date()
        five_days_later = today+timedelta(days=5)

        return Batch.objects.filter(
            expiry_date__gte = today,
            expiry_date__lte = five_days_later
        )
    serializer_class = Batch_serializer
    permission_classes = [IsAuthenticated]

class Inventory_viewset(viewsets.ModelViewSet):
    queryset = Inventory.objects.all() 
    serializer_class = Inventory_serializer
    permission_classes = [IsAdminUser | IsPharmacist]

class Suppliers_viewset(viewsets.ModelViewSet):
    queryset = User.objects.filter(role='SUPPLIER')
    serializer_class = Suppliers_serializer
    permission_classes = [IsSupplier | IsAuthenticated]

class Pharmacist_viewset(viewsets.ModelViewSet):
    queryset = User.objects.filter(role='PHARMACIST')
    serializer_class = Pharmacist_serializer
    permission_classes = [IsPharmacist | IsAuthenticated | IsAdminUser]


class Stock_Order_viewset(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = Order_serializer
    permission_classes = [IsPharmacist | IsSupplier | IsAdminUser]

    """
    AI code 
    Take data from react, chick it, save it to database, and send back success
    request.data = the react payload.

    many=isinstance() -> Is the data a list or just 1 object. check what type this is.
    if react send {{...}, {...} } then many=True. 
    if react send {...} then many=False.
    Because DRF works differently for 1 item vs many itmes.

    serializer = self.get_serializer() -> Translate btween python and JSON
    data = reqest.data -> here is the row data form react, please check it.
    many=many -> check 1 item or a list of items based on what we found above at the isinstance().
    
    is_valid() -> cheack if the data form react is valid and in the right format. if its not stop and throw the error to react immediately.

    self.perform_create() -> means data is valid. save it to the DB.
    It creates all the Order_Items inside because we wrote that logic in the serializer.

    return -> Send back the save data to react and say success.
    serializer.data = data after saving.

    Full story:
    React Sends you a box of data.
    Check if box has 1 toy or many toys.
    Give box the translator and say check 1 or many.
    Translator checks if everyting is correct. if not, yell error.
    If correct, save to DB
    Send back Saved data to react.
    """

    def create(self, request, *args, **kwargs):
        many = isinstance(request.data, list)
        serializer = self.get_serializer(data=request.data, many=many)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=201)


class SupplierHistory(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = Order_serializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['supplier']
    permission_classes = [IsPharmacist | IsAdminUser]

class PharmacistBill_history(viewsets.ModelViewSet):
    queryset = Bill.objects.all().order_by('-created_at')
    serializer_class = Bill_serializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['pharmacist']
    permission_classes = [IsPharmacist]

class Bill_viewset(viewsets.ModelViewSet):
    queryset = Bill.objects.all().order_by('-created_at')
    serializer_class = Bill_serializer
    permission_classes = [IsPharmacist]

from .models import User
from .serializers import Signup_serializer
class Signup_view(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = Signup_serializer
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data = request.data)
        serializer.is_valid(raise_exception = True)
        self.perform_create(serializer)
        return Response(status=status.HTTP_201_CREATED)

from .serializers import Login_serializer
from rest_framework.views import APIView
class Login_view(APIView):
    def post(self, request):
        serializer = Login_serializer(data = request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        return Response({
            "username": user.username
        })

# After django filter backend
from rest_framework.decorators import action
class ProfileViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    
    
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
class CurrentUser(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            'userId': request.user.id,
            'username': request.user.username,
            'first_name':request.user.first_name,
            'email':request.user.email,
            'role':request.user.role,

        })

class TodayOrders(viewsets.ModelViewSet):
    def get_queryset(self):
        today = timezone.now().date()
        return Order.objects.filter(created_at = today)

    serializer_class = Order_serializer
    permission_classes = [IsPharmacist | IsAdminUser]