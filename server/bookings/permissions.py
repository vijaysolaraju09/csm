from rest_framework import permissions


class IsBookingOwnerOrServiceOwner(permissions.BasePermission):
    """Allow access to the booking creator and the service owner."""

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return obj.user == request.user or obj.service.owner == request.user
        return obj.user == request.user or obj.service.owner == request.user
