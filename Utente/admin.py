from django.contrib import admin

from Utente.models import Utente


# Register your models here.
@admin.register(Utente)
class UtenteAdmin(admin.ModelAdmin):
    list_display = ('user', 'ruolo', 'telefono')
    search_fields = ('user__username', 'ruolo')