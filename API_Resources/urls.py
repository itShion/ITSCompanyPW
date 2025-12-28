from rest_framework.routers import DefaultRouter, SimpleRouter

from API_Resources.viewsets import TipoRisorsaAPIViewSet, RisorsaAPIViewSet

router = SimpleRouter()
router.register('tipo-risorse', TipoRisorsaAPIViewSet, basename='tipo-risorse')
router.register('risorse', RisorsaAPIViewSet, basename='risorse')

urlpatterns = [
    *router.urls
]
