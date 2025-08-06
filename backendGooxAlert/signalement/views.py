from rest_framework import generics, permissions
from .models import Signalement
from .serializers import SignalementSerializer

class SignalementListCreateView(generics.ListCreateAPIView):
    serializer_class = SignalementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Retourne uniquement les signalements de l'utilisateur connecté
        return Signalement.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class SignalementDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SignalementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Retourne uniquement les signalements de l'utilisateur connecté
        return Signalement.objects.filter(user=self.request.user)
