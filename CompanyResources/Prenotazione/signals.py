from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from CompanyResources.Prenotazione.models import Prenotazione

@receiver(pre_save, sender=Prenotazione)
def salva_stato_precedente(sender, instance, **kwargs):
    if instance.pk:
        old = Prenotazione.objects.get(pk=instance.pk)
        instance._stato_precedente = old.stato
    else:
        instance._stato_precedente = None

@receiver(post_save, sender=Prenotazione)
def gestisci_notifiche(sender, instance, created, **kwargs):
    from CompanyResources.Utente.models import Utente
    from CompanyResources.Notifica.services import NotificaService

    if created:
        responsabili = Utente.objects.filter(ruolo__in=["RESPONSABILE", "ADMIN"])
        for r in responsabili:
            NotificaService.crea_notifica(
                utente=r,
                titolo="Nuova prenotazione",
                messaggio=f"{instance.utente.user.username} ha prenotato {instance.risorsa.nome}",
                tipo="BOOKING_PENDING"
            )

    if instance._stato_precedente != instance.stato:
        if instance.stato == "CONFERMATA":
            NotificaService.crea_notifica(
                utente=instance.utente,
                titolo="Prenotazione approvata",
                messaggio=f"La tua prenotazione per {instance.risorsa.nome} è stata approvata",
                tipo="BOOKING_APPROVED"
            )
        elif instance.stato == "ANNULLATA":
            NotificaService.crea_notifica(
                utente=instance.utente,
                titolo="Prenotazione rifiutata",
                messaggio=f"La tua prenotazione per {instance.risorsa.nome} è stata rifiutata",
                tipo="BOOKING_REJECTED"
            )