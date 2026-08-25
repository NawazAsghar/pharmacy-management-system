from rest_framework.permissions import BasePermission

class IsPharmacist(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == "PHARMACIST"
    
    def has_object_permission(self, request, view, obj):
        return request.user.role == "PHARMACIST"

class IsSupplier(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == "SUPPLIER"
    
    def has_object_permission(self, request, view, obj):
        return request.user.role == "SUPPLIER"