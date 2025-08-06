# models.py
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

CATEGORIE_CHOICES = [
    ('voirie', 'Voirie (nids-de-poule, routes abîmées)'),
    ('infrastructure', 'Infrastructure publique'),
    ('eclairage', 'Éclairage public'),
    ('ordures', 'Gestion des ordures'),
    ('eau', 'Problèmes d\'eau'),
    ('assainissement', 'Assainissement'),
    ('pollution', 'Pollution'),
    ('espaces_verts', 'Espaces verts'),
    ('securite', 'Sécurité publique'),
    ('signalisation', 'Signalisation'),
    ('transport', 'Transports publics'),
    ('animaux_errants', 'Animaux errants'),
    ('urbanisme', 'Urbanisme'),
    ('autre', 'Autre'),
]

STATUT_CHOICES = [
    ('en_attente', 'En attente'),
    ('en_cours', 'En cours'),
    ('resolu', 'Résolu'),
    ('rejected', 'Rejeté'),
]

class Signalement(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='signalements')
    title = models.CharField(max_length=255)
    description = models.TextField()
    image_url = models.URLField(blank=True, null=True)
    location = models.CharField(max_length=255)
    category = models.CharField(max_length=50, choices=CATEGORIE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUT_CHOICES, default='en_attente')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.category}"
