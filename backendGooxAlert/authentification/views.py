from django.http import JsonResponse
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from signalement.serializers import SignalementSerializer
from signalement.models import Signalement

from .serializers import (
    UserSerializer, LoginSerializer, UpdatePersonalInfoSerializer, 
    ChangePasswordSerializer, RequestPasswordResetSerializer, 
    ResetPasswordSerializer, AdminUserSerializer, UpdateUserRoleSerializer
)
from .models import User
from .permissions import IsAdminUser

from django.utils import timezone
from datetime import timedelta
import random
from .twilio_client import send_sms


# Ceci pourrait etre reutilise un peu partout
def get_user_data(user):
    return {
        'id': user.id,
        'full_name': user.full_name,
        'telephone': user.telephone,
        'commune': user.commune,
        'image_url': user.image_url,
        'role': user.role,
    }

from .services import ImgBBService


class RegisterUserAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class LoginAPIView(APIView):
    def post(self, request):
        try:
            serializer = LoginSerializer(data=request.data)
            if serializer.is_valid():
                telephone = serializer.validated_data['telephone']
                password = serializer.validated_data['password']

                print(f"telephone: {telephone}, password: {password}")
                
                user = authenticate(request, username=telephone, password=password)

                if user:
                    refresh = RefreshToken.for_user(user)
                    
                    # Récupérer les signalements de l'utilisateur
                    signalements = Signalement.objects.filter(user=user).order_by('-created_at')
                    signalements_serializer = SignalementSerializer(signalements, many=True)
                    
                    return Response({
                        'status': 'success',
                        'user': get_user_data(user),
                        'signalements': signalements_serializer.data,
                        'tokens': {
                            'refresh': str(refresh),
                            'access': str(refresh.access_token),
                        }
                    })
                else:
                    return Response({
                        'status': 'error',
                        'message': 'Numéro de téléphone ou mot de passe incorrect'
                    }, status=status.HTTP_401_UNAUTHORIZED)

            return Response({
                'status': 'error',
                'message': 'Données invalides',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class ProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({
            'status': 'success',
            'profile': serializer.data
        })

    def put(self, request):
        if 'profile_picture' not in request.FILES:
            return Response({
                'status': 'error',
                'message': 'Aucune image n\'a été fournie'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            imgbb_service = ImgBBService()
            image_url = imgbb_service.upload_image(request.FILES['profile_picture'])

            user = request.user
            serializer = UserSerializer(user, data={'image_url': image_url}, partial=True)
            if serializer.is_valid():
                serializer.save()

                user_data = get_user_data(user)

                return Response({
                    'status': 'success',
                    'user': user_data
                })

            return Response({
                'status': 'error',
                'message': 'Données invalides',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class CurrentUserAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({
            'status': 'success',
            'user': serializer.data
        })


class UpdatePersonalInfoAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        try:
            user = request.user

            serializer = UserSerializer(user, data=request.data, partial=True)

            if serializer.is_valid():
                serializer.save()

                user_data = get_user_data(user=user)
                refresh = RefreshToken.for_user(user)
                
                return Response({
                    'status': 'success',
                    'user': user_data,
                    'tokens': {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    }
                })

        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ChangePasswordAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
            
            if serializer.is_valid():
                user = request.user
                user.set_password(serializer.validated_data['new_password'])
                user.save()
                
                # Générer de nouveaux tokens car le mot de passe a changé
                refresh = RefreshToken.for_user(user)
                
                return Response({
                    'status': 'success',
                    'message': 'Mot de passe modifié avec succès',
                    'tokens': {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    }
                })
            
            return Response({
                'status': 'error',
                'message': 'Mot de passe incorrect',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RequestPasswordResetAPIView(APIView):
    def post(self, request):
        try:
            serializer = RequestPasswordResetSerializer(data=request.data)
            if serializer.is_valid():
                telephone = serializer.validated_data['telephone']
                
                # Vérifier si le numéro existe
                try:
                    user = User.objects.get(telephone=telephone)
                    return Response({
                        'status': 'success',
                        'message': 'Un code de réinitialisation a été envoyé à votre numéro de téléphone.',
                        'telephone': telephone  # On renvoie le numéro pour la prochaine étape
                    })
                except User.DoesNotExist:
                    return Response({
                        'status': 'error',
                        'message': 'Aucun compte n\'est associé à ce numéro de téléphone.'
                    }, status=status.HTTP_404_NOT_FOUND)

            return Response({
                'status': 'error',
                'message': 'Données invalides',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ResetPasswordAPIView(APIView):
    def post(self, request):
        try:
            serializer = ResetPasswordSerializer(data=request.data)
            if serializer.is_valid():
                telephone = serializer.validated_data['telephone']
                new_password = serializer.validated_data['new_password']

                try:
                    user = User.objects.get(telephone=telephone)
                except User.DoesNotExist:
                    return Response({
                        'status': 'error',
                        'message': 'Aucun compte n\'est associé à ce numéro de téléphone.'
                    }, status=status.HTTP_404_NOT_FOUND)

                # Mettre à jour le mot de passe
                user.set_password(new_password)
                user.save()

                # Générer de nouveaux tokens
                refresh = RefreshToken.for_user(user)

                return Response({
                    'status': 'success',
                    'message': 'Mot de passe réinitialisé avec succès.',
                    'tokens': {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    }
                })

            return Response({
                'status': 'error',
                'message': 'Données invalides',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AdminUserListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        try:
            users = User.objects.all().order_by('-date_joined')
            serializer = AdminUserSerializer(users, many=True)
            
            return Response({
                'status': 'success',
                'users': serializer.data
            })
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AdminUpdateUserRoleView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def put(self, request, user_id):
        try:
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return Response({
                    'status': 'error',
                    'message': 'Utilisateur non trouvé'
                }, status=status.HTTP_404_NOT_FOUND)

            serializer = UpdateUserRoleSerializer(user, data=request.data, partial=True)
            
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'status': 'success',
                    'message': 'Rôle mis à jour avec succès',
                    'user': AdminUserSerializer(user).data
                })
            
            return Response({
                'status': 'error',
                'message': 'Données invalides',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




















# Facultatif : Twilio SMS (si tu veux l'activer plus tard)
# from twilio.rest import Client
# from django.conf import settings
#
# def send_sms(to_number, message):
#     client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
#     message = client.messages.create(
#         body=message,
#         from_=settings.TWILIO_PHONE_NUMBER,
#         to=to_number
#     )
#     return message.sid
#
# def test_sms(request):
#     sid = send_sms('+221774189439', 'Hello from Django!')
#     return JsonResponse({'message_sid': sid})

# from django.conf import settings
#
# def send_sms(to_number, message):
#     client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
#     message = client.messages.create(
#         body=message,
#         from_=settings.TWILIO_PHONE_NUMBER,
#         to=to_number
#     )
#     return message.sid
#
# def test_sms(request):
#     sid = send_sms('+221774189439', 'Hello from Django!')
#     return JsonResponse({'message_sid': sid})
