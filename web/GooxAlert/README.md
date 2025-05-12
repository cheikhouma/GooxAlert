# GooxAlert

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

GooxAlert est une application web moderne permettant aux citoyens de signaler et suivre les problèmes urbains dans leur ville. L'application offre une interface intuitive pour la gestion des signalements et un tableau de bord administratif pour le suivi des problèmes.

## 📸 Captures d'écran

### Page d'accueil
![Page d'accueil](docs/screenshots/home.png)

### Carte interactive
![Carte interactive](docs/screenshots/map.png)

### Tableau de bord
![Tableau de bord](docs/screenshots/dashboard.png)

## 🚀 Fonctionnalités

### Pour les Citoyens
- 📝 Signalement de problèmes urbains
  - Upload de photos
  - Géolocalisation automatique
  - Catégorisation des problèmes
- 🗺️ Visualisation des problèmes sur une carte interactive
  - Filtrage par catégorie
  - Recherche par localisation
  - Vue détaillée des problèmes
- 👤 Gestion du profil utilisateur
  - Modification des informations
  - Changement d'avatar
  - Historique des signalements
- 📊 Tableau de bord personnel des signalements
  - Suivi de l'état des signalements
  - Statistiques personnelles
  - Notifications en temps réel
- 🔍 Recherche et filtrage des problèmes
  - Par catégorie
  - Par statut
  - Par date

### Pour les Administrateurs
- 👥 Gestion des utilisateurs
  - Liste des utilisateurs
  - Modification des rôles
  - Désactivation de comptes
- 📊 Tableau de bord administratif
  - Vue d'ensemble des signalements
  - Statistiques globales
  - Taux de résolution
- 📈 Statistiques et rapports
  - Export de données
  - Graphiques d'analyse
  - Rapports périodiques
- ⚙️ Gestion des catégories de problèmes
  - Création de catégories
  - Modification des catégories
  - Attribution des responsables

## 🛠️ Technologies Utilisées

### Frontend
- **React 18** - Bibliothèque UI
- **TypeScript** - Typage statique
- **React Router v6** - Routage
- **Tailwind CSS** - Styling
- **Lucide Icons** - Icônes
- **React Query** - Gestion des données
- **Zustand** - Gestion d'état

### Outils de Développement
- **Vite** - Build tool
- **ESLint** - Linting
- **Prettier** - Formatting
- **Vitest** - Testing
- **Playwright** - E2E Testing

## 📦 Installation

1. Clonez le repository :
```bash
git clone https://github.com/votre-username/gooxalert.git
cd gooxalert
```

2. Installez les dépendances :
```bash
npm install
```

3. Lancez l'application en mode développement :
```bash
npm run dev
```

L'application sera accessible à l'adresse `http://localhost:5173`

## 🔧 Configuration

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
VITE_API_URL=votre_url_api
VITE_MAP_API_KEY=votre_cle_api_carte
VITE_STORAGE_URL=votre_url_stockage
```

## 🏗️ Structure du Projet

```
src/
├── components/          # Composants réutilisables
│   ├── auth/           # Composants d'authentification
│   ├── layout/         # Composants de mise en page
│   └── ui/             # Composants UI génériques
├── contexts/           # Contextes React
│   └── AuthContext.tsx # Contexte d'authentification
├── pages/              # Pages de l'application
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   └── ...
├── types/              # Types TypeScript
│   └── index.ts
└── utils/              # Utilitaires
    ├── api.ts
    └── validation.ts
```

## 💻 Exemples de Code

### Composant de Signalement
```typescript
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { issueSchema } from '../schemas/issue';

const ReportIssue: React.FC = () => {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(issueSchema)
  });

  const onSubmit = async (data: IssueFormData) => {
    try {
      await createIssue(data);
      toast.success('Problème signalé avec succès !');
    } catch (error) {
      toast.error('Erreur lors du signalement');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Formulaire de signalement */}
    </form>
  );
};
```

### Hook d'Authentification
```typescript
import { useAuth } from '../contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  
  const handleUpdate = async (data: ProfileData) => {
    await updateProfile(data);
  };

  return (
    <div>
      <h1>Profil de {user.name}</h1>
      {/* Contenu du profil */}
    </div>
  );
};
```

## 🔐 Authentification

L'application utilise un système d'authentification basé sur les rôles :
- **Utilisateur** : Accès aux fonctionnalités de base
  - Signalement de problèmes
  - Visualisation de la carte
  - Gestion du profil
- **Administrateur** : Accès complet
  - Gestion des utilisateurs
  - Tableau de bord admin
  - Configuration système

## 🎨 Interface Utilisateur

L'interface est construite avec Tailwind CSS et offre :
- Design responsive
  - Mobile-first
  - Breakpoints personnalisés
  - Composants adaptatifs
- Thème sombre/clair
  - Support du mode sombre
  - Thèmes personnalisables
  - Transitions fluides
- Composants modernes
  - Accessibilité (WCAG 2.1)
  - Animations fluides
  - Feedback utilisateur
- Performance optimisée
  - Lazy loading
  - Code splitting
  - Optimisation des images

## 🧪 Tests

### Tests Unitaires
```bash
npm test
```

### Tests E2E
```bash
npm run test:e2e
```

### Couverture de Tests
```bash
npm run test:coverage
```

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commiter vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Pousser vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

### Guide de Contribution
- Suivez les conventions de code
- Ajoutez des tests pour les nouvelles fonctionnalités
- Mettez à jour la documentation
- Respectez les standards de commit

## 📞 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Contacter l'équipe de support à support@gooxalert.com
- Consulter la [documentation](https://docs.gooxalert.com)

## 🙏 Remerciements

- Tous les contributeurs
- La communauté open source
- Les utilisateurs de GooxAlert
- Les bibliothèques et outils utilisés

## 📚 Documentation Additionnelle

- [Guide de Démarrage](docs/getting-started.md)
- [Guide de Contribution](docs/contributing.md)
- [Architecture](docs/architecture.md)
- [API Reference](docs/api.md) 