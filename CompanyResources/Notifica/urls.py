from django.urls import path
from . import views

urlpatterns = [
    path('unread/', views.notifiche_unread, name='notifiche_unread'),
    path('<int:id>/mark_read/', views.mark_read, name='mark_read'),
]