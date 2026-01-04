from rest_framework.routers import DefaultRouter, SimpleRouter

from CompanyResources.API_Resources.viewsets import TipoRisorsaAPIViewSet, RisorsaAPIViewSet, UtenteAPIViewSet, PrenotazioneAPIViewSet

router = SimpleRouter()
router.register('tipo-risorse', TipoRisorsaAPIViewSet, basename='tipo-risorse')
router.register('risorse', RisorsaAPIViewSet, basename='risorse')
router.register('utenti', UtenteAPIViewSet, basename='utenti')
router.register('prenotazioni', PrenotazioneAPIViewSet, basename='prenotazioni')

urlpatterns = [
    *router.urls
]
