from django.urls import path
from .views import SignalementListCreateView, SignalementDetailView

urlpatterns = [
    path('api/signalement/', SignalementListCreateView.as_view(), name='signalement-list-create'),
    path('api/signalements/<int:pk>/', SignalementDetailView.as_view(), name='signalement-detail'),
]
