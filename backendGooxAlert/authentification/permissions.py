from rest_framework import permissions

class IsAdminUser(permissions.BasePermission):
    """
    Permission personnalisée pour n'autoriser que les utilisateurs avec le rôle 'admin'.
    """
    def has_permission(self, request, view):
        return request.user and request.user.role == 'admin' 