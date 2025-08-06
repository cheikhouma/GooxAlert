# serializers.py
from rest_framework import serializers
from signalement.models import Signalement

class SignalementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Signalement
        fields = '__all__'
        read_only_fields = ['id', 'user', 'created_at', 'status']
