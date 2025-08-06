from django.core.management.base import BaseCommand
from authentification.models import User
import re

class Command(BaseCommand):
    help = 'Crée un utilisateur administrateur'

    def add_arguments(self, parser):
        parser.add_argument('--telephone', type=str, help='Numéro de téléphone de l\'administrateur')
        parser.add_argument('--password', type=str, help='Mot de passe de l\'administrateur')
        parser.add_argument('--full_name', type=str, help='Nom complet de l\'administrateur')
        parser.add_argument('--commune', type=str, help='Commune de l\'administrateur')

    def handle(self, *args, **options):
        telephone = options['telephone']
        password = options['password']
        full_name = options['full_name']
        commune = options['commune']

        # Validation du numéro de téléphone
        if telephone.startswith("7"):
            telephone = "00221" + telephone
        if telephone.startswith("+"):
            telephone = telephone.replace("+", "00")
            
        cleaned_phone = telephone.replace('+', '00').replace(' ', '')
        if not re.match(r'^(00221)?7[05678][0-9]{7}$', cleaned_phone):
            self.stdout.write(self.style.ERROR('Le numéro de téléphone doit être un numéro sénégalais valide.'))
            return

        # Vérifier si l'utilisateur existe déjà
        if User.objects.filter(telephone=cleaned_phone).exists():
            self.stdout.write(self.style.ERROR('Un utilisateur avec ce numéro de téléphone existe déjà.'))
            return

        try:
            user = User.objects.create(
                username=cleaned_phone,
                telephone=cleaned_phone,
                full_name=full_name,
                commune=commune,
                role='admin',
                is_staff=True,
                is_superuser=True
            )
            user.set_password(password)
            user.save()
            
            self.stdout.write(self.style.SUCCESS(f'Administrateur créé avec succès !'))
            self.stdout.write(self.style.SUCCESS(f'Numéro de téléphone: {cleaned_phone}'))
            self.stdout.write(self.style.SUCCESS(f'Nom: {full_name}'))
            self.stdout.write(self.style.SUCCESS(f'Rôle: admin'))
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Erreur lors de la création de l\'administrateur: {str(e)}'))