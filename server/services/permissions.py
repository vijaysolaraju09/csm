from rest_framework import permissions


class IsServiceOwnerOrReadOnly(permissions.BasePermission):
    """Allow providers to manage their own services and read-only otherwise."""

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and getattr(request.user, "is_provider", False)

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.owner == request.user
