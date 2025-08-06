from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

# Create your models here.

class User(AbstractUser):
    groups = models.ManyToManyField(
        Group,
        related_name='authentification_users',
        blank=True,
        help_text='Groups this user belongs to.',
        verbose_name='groups',
        related_query_name='authentification_user',
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='authentification_users',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
        related_query_name='authentification_user',
    )

    full_name = models.CharField(max_length=150)
    telephone = models.CharField(max_length=20, unique=True)
    commune = models.CharField(max_length=100)
    image_url = models.CharField(max_length=500, default="https://dummyimage.com/900x400/dee2e6/6c757d.jpg")
    role = models.CharField(max_length=50, default="user")
    terms = models.BooleanField(default=True)
    
   
    USERNAME_FIELD = 'telephone'
    REQUIRED_FIELDS = ['full_name']

    def __str__(self):
        return self.telephone

