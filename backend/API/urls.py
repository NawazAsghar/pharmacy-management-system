from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import Items_viewset, Batch_viewset, Inventory_viewset, Stock_Order_viewset, Bill_viewset, Login_view, Signup_view, Suppliers_viewset, Pharmacist_viewset,  ProfileViewSet, CurrentUser, SupplierHistory, TodayOrders, PharmacistBill_history

router = DefaultRouter()
router.register('items', Items_viewset, basename="Items")
router.register('batch', Batch_viewset, basename="Batch")
router.register('inventory', Inventory_viewset, basename="Inventory")
router.register('stockOrder', Stock_Order_viewset, basename="StockOrder")
router.register('bill', Bill_viewset, basename="Bill")
router.register('signup', Signup_view, basename="Signup")
router.register('suppliers', Suppliers_viewset, basename="Supplier")
router.register('suppliersHistory', SupplierHistory, basename="SupplierHistory")
router.register('pharmacist_viewset', Pharmacist_viewset, basename="Pharmacist_viewset")
router.register('pharmacistBill_history', PharmacistBill_history, basename="PharmacistBill_history")
router.register('profile', ProfileViewSet, basename="Profile")
router.register('todayOrders', TodayOrders, basename="TodayOrders")

# for jwt 
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('', include(router.urls)),
    path('login/', Login_view.as_view(), name="Login_view"),
    path('me/', CurrentUser.as_view(), name="CurrentUser"),

    # for JWT
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_view'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh')
]