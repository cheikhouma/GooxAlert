from rest_framework import serializers
from .models import User
import re

class LoginSerializer(serializers.Serializer):
    telephone = serializers.CharField(max_length=20, required=True)
    password = serializers.CharField(write_only=True, required=True)

    def validate_telephone(self, value):
        if value.startswith("7"):
            value = "00221" + value
        if value.startswith("+"):
            value = value.replace("+", "00")
            
        cleaned_phone = value.replace('+', '00').replace(' ', '')
        if not cleaned_phone.isdigit() or len(cleaned_phone) < 9:
            raise serializers.ValidationError("Le numéro de téléphone doit être valide.")
        
        return value


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    telephone = serializers.CharField(max_length=20)

    class Meta:
        model = User
        fields = ['id', 'full_name', 'telephone', 'commune', 'password', 'image_url', 'role', 'terms']
        extra_kwargs = {
            'role': {'read_only': True},  # on ne laisse pas l'utilisateur définir son rôle
        }

    def validate_telephone(self, value):
        if value.startswith("7"):
            value = "00221" + value
        if value.startswith("+"):
            value = value.replace("+", "00")

        # Validation sur la valeur modifiée
        if not re.match(r'^(00221)?7[05678][0-9]{7}$', value):
            raise serializers.ValidationError("Le numéro doit être un numéro sénégalais valide.")

        return value

    def create(self, validated_data):
        user = User(
            username=validated_data['telephone'],
            telephone=validated_data['telephone'],
            full_name=validated_data['full_name'],
            commune=validated_data['commune'],
            role='user',  # sécurité: on force le rôle
            terms=validated_data.get('terms', True),  # si tu ajoutes le champ terms
            image_url="https://i.ibb.co/DHYkxSYT/OIP-1.jpg"
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class UpdatePersonalInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['full_name', 'telephone']

    def validate_telephone(self, value):
        if value.startswith("7"):
            value = "00221" + value
        if value.startswith("+"):
            value = value.replace("+", "00")

        # Validation sur la valeur modifiée
        if not re.match(r'^(00221)?7[05678][0-9]{7}$', value):
            raise serializers.ValidationError("Le numéro doit être un numéro sénégalais valide.")

        # Vérifier si le numéro existe déjà
        if User.objects.filter(telephone=value).exclude(id=self.instance.id).exists():
            raise serializers.ValidationError("Ce numéro de téléphone est déjà utilisé.")

        return value

class UpdateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['full_name', 'commune', 'image_url', 'terms']
        extra_kwargs = {
            'full_name': {'required': False},
            'commune': {'required': False},
            'image_url': {'required': False},
            'terms': {'required': False}
        }

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True, required=True)
    new_password = serializers.CharField(write_only=True, required=True, min_length=6)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("L'ancien mot de passe est incorrect.")
        return value

    def validate_new_password(self, value):
        if value == self.context['request'].user.password:
            raise serializers.ValidationError("Le nouveau mot de passe ne peut pas être le même que l'ancien.")
        return value

class RequestPasswordResetSerializer(serializers.Serializer):
    telephone = serializers.CharField(max_length=20, required=True)

    def validate_telephone(self, value):
        if value.startswith("7"):
            value = "00221" + value
        if value.startswith("+"):
            value = value.replace("+", "00")
            
        cleaned_phone = value.replace('+', '00').replace(' ', '')
        if not re.match(r'^(00221)?7[05678][0-9]{7}$', cleaned_phone):
            raise serializers.ValidationError("Le numéro doit être un numéro sénégalais valide.")
        
        # Vérifier si le numéro existe dans la base de données
        if not User.objects.filter(telephone=cleaned_phone).exists():
            raise serializers.ValidationError("Aucun compte n'est associé à ce numéro de téléphone.")
        
        return cleaned_phone

class ResetPasswordSerializer(serializers.Serializer):
    telephone = serializers.CharField(max_length=20, required=True)
    new_password = serializers.CharField(write_only=True, required=True, min_length=6)

    def validate_telephone(self, value):
        if value.startswith("7"):
            value = "00221" + value
        if value.startswith("+"):
            value = value.replace("+", "00")
            
        cleaned_phone = value.replace('+', '00').replace(' ', '')
        if not re.match(r'^(00221)?7[05678][0-9]{7}$', cleaned_phone):
            raise serializers.ValidationError("Le numéro doit être un numéro sénégalais valide.")
        return cleaned_phone

class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'full_name', 'telephone', 'commune', 'image_url', 'role', 'is_active', 'date_joined']
        read_only_fields = ['id', 'date_joined']

class UpdateUserRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['role']

    def validate_role(self, value):
        valid_roles = ['user', 'admin', 'moderator']  # Ajoutez ici tous les rôles valides
        if value not in valid_roles:
            raise serializers.ValidationError(f"Le rôle doit être l'un des suivants : {', '.join(valid_roles)}")
        return value
