from rest_framework import permissions


class IsReviewAuthorOrServiceOwner(permissions.BasePermission):
    """Allow booking author to manage review and service owner to read."""

    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        booking_user = obj.booking.user
        service_owner = obj.booking.service.owner
        if request.method in permissions.SAFE_METHODS:
            return request.user in {booking_user, service_owner}
        return request.user == booking_user
