# auth_views.py
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

from CompanyResources.Utente.models import Utente


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user:
            # Genera token JWT
            refresh = RefreshToken.for_user(user)

            # Ottieni o crea profilo Utente
            utente, created = Utente.objects.get_or_create(
                user=user,
                defaults={'ruolo': 'Dipendente', 'telefono': ''}
            )

            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'ruolo': utente.ruolo,
                    'telefono': utente.telefono,
                    'utente_id': utente.id
                }
            })

        return Response(
            {'error': 'Credenziali non valide'},
            status=status.HTTP_401_UNAUTHORIZED
        )


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        telefono = request.data.get('telefono', '')
        first_name = request.data.get('first_name', '')
        last_name = request.data.get('last_name', '')

        # Validazioni
        if not username or not password or not email:
            return Response(
                {'error': 'Username, email e password sono obbligatori'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(username=username).exists():
            return Response(
                {'error': 'Username già esistente'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Crea utente
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )

        # Crea profilo Utente
        utente = Utente.objects.create(
            user=user,
            ruolo='Dipendente',
            telefono=telefono
        )

        # Auto-login dopo registrazione
        refresh = RefreshToken.for_user(user)

        return Response({
            'message': 'Registrazione completata',
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'ruolo': utente.ruolo,
                'telefono': utente.telefono,
                'utente_id': utente.id
            }
        }, status=status.HTTP_201_CREATED)


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        utente, created = Utente.objects.get_or_create(
            user=user,
            defaults={'ruolo': 'Dipendente', 'telefono': ''}
        )

        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'ruolo': utente.ruolo,
            'telefono': utente.telefono,
            'utente_id': utente.id
        })