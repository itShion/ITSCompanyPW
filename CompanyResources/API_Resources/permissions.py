from rest_framework import permissions

__all__ = [
    "IsUtente",
    "IsResponsabile",
    "IsAdmin",
    "IsResponsabileOrAdmin",
    "IsOwnerOrResponsabile",
]

class IsUtente(permissions.BasePermission):

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        try:
            utente = request.user.utente
            return utente.ruolo == 'UTENTE'
        except:
            return False


class IsResponsabile(permissions.BasePermission):

    def has_permission(self, request, view):

        if not request.user or not request.user.is_authenticated:
            return False

        try:
            utente = request.user.utente
            return utente.ruolo == 'RESPONSABILE'
        except:
            return False


class IsAdmin(permissions.BasePermission):

    def has_permission(self, request, view):

        if not request.user or not request.user.is_authenticated:
            return False

        # Admin può essere sia superuser che ruolo ADMIN
        if request.user.is_superuser:
            return True

        try:
            utente = request.user.utente
            return utente.ruolo == 'ADMIN'
        except:
            return False


class IsResponsabileOrAdmin(permissions.BasePermission):

    def has_permission(self, request, view):

        if not request.user or not request.user.is_authenticated:
            return False

        if request.user.is_superuser:
            return True

        try:
            utente = request.user.utente
            return utente.ruolo in ['RESPONSABILE', 'ADMIN']
        except:
            return False


class IsOwnerOrResponsabile(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):

        if not request.user or not request.user.is_authenticated:
            return False

        # Admin può tutto
        if request.user.is_superuser:
            return True

        # Controlla se è responsabile
        try:
            utente = request.user.utente
            if utente.ruolo in ['RESPONSABILE', 'ADMIN']:
                return True
        except:
            pass


        return hasattr(obj, 'utente') and obj.utente.user == request.user