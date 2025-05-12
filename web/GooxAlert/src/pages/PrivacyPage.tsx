import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';

const PrivacyPage = () => {
  const sections = [
    {
      icon: <Icons.Database className="h-6 w-6" />,
      title: "Données collectées",
      content: (
        <ul className="space-y-2">
          <li className="flex items-center">
            <Icons.Check className="h-5 w-5 text-success-500 mr-2" />
            Informations de compte (nom, email, mot de passe chiffré)
          </li>
          <li className="flex items-center">
            <Icons.Check className="h-5 w-5 text-success-500 mr-2" />
            Signalements (description, localisation, photos)
          </li>
          <li className="flex items-center">
            <Icons.Check className="h-5 w-5 text-success-500 mr-2" />
            Données d'utilisation et préférences
          </li>
        </ul>
      )
    },
    {
      icon: <Icons.Settings className="h-6 w-6" />,
      title: "Utilisation des données",
      content: (
        <ul className="space-y-2">
          <li className="flex items-center">
            <Icons.ArrowRight className="h-5 w-5 text-primary-500 mr-2" />
            Gestion de votre compte et signalements
          </li>
          <li className="flex items-center">
            <Icons.ArrowRight className="h-5 w-5 text-primary-500 mr-2" />
            Amélioration de l'expérience utilisateur
          </li>
          <li className="flex items-center">
            <Icons.ArrowRight className="h-5 w-5 text-primary-500 mr-2" />
            Notifications personnalisées
          </li>
        </ul>
      )
    },
    {
      icon: <Icons.Shield className="h-6 w-6" />,
      title: "Sécurité",
      content: (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Protection des données</h4>
            <p className="text-gray-600">Chiffrement de bout en bout, accès restreint, sauvegardes régulières</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Conformité RGPD</h4>
            <p className="text-gray-600">Respect des normes européennes de protection des données</p>
          </div>
        </div>
      )
    },
    {
      icon: <Icons.UserCheck className="h-6 w-6" />,
      title: "Vos droits",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-primary-50 p-4 rounded-lg">
            <Icons.Eye className="h-5 w-5 text-primary-500 mb-2" />
            <h4 className="font-medium">Accès aux données</h4>
            <p className="text-gray-600">Consultez vos informations personnelles</p>
          </div>
          <div className="bg-primary-50 p-4 rounded-lg">
            <Icons.Edit className="h-5 w-5 text-primary-500 mb-2" />
            <h4 className="font-medium">Modification</h4>
            <p className="text-gray-600">Modifiez ou supprimez vos données</p>
          </div>
          <div className="bg-primary-50 p-4 rounded-lg">
            <Icons.Bell className="h-5 w-5 text-primary-500 mb-2" />
            <h4 className="font-medium">Notifications</h4>
            <p className="text-gray-600">Gérez vos préférences de notification</p>
          </div>
          <div className="bg-primary-50 p-4 rounded-lg">
            <Icons.LogOut className="h-5 w-5 text-primary-500 mb-2" />
            <h4 className="font-medium">Suppression</h4>
            <p className="text-gray-600">Supprimez votre compte à tout moment</p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-8">
            <Icons.Shield className="h-16 w-16" />
          </div>
          <h1 className="text-4xl font-bold text-center mb-4">
            Politique de Confidentialité
          </h1>
          <p className="text-xl text-center text-primary-100">
            Votre vie privée est notre priorité
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <p className="text-lg text-gray-700 mb-8">
            Chez <span className="font-semibold text-primary-600">GooxAlert</span>, 
            nous accordons une grande importance à la confidentialité de vos données. 
            Cette page explique comment nous collectons, utilisons et protégeons vos informations personnelles.
          </p>

          <div className="space-y-12">
            {sections.map((section, index) => (
              <div 
                key={index}
                className="border-b border-gray-200 pb-8 last:border-0 last:pb-0"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-primary-100 p-2 rounded-lg mr-4">
                    {section.icon}
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {section.title}
                  </h2>
                </div>
                <div className="ml-12">
                  {section.content}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex items-center mb-4">
            <Icons.Mail className="h-6 w-6 text-primary-500 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900">Contact</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Pour toute question concernant vos données personnelles, notre équipe est à votre disposition.
          </p>
          <a 
            href="mailto:support@gooxalert.com" 
            className="inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            <Icons.Mail className="h-5 w-5 mr-2" />
            support@gooxalert.com
          </a>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link 
            to="/" 
            className="inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            <Icons.ArrowLeft className="h-5 w-5 mr-2" />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;