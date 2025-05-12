import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';

const TermsPage = () => {
  const sections = [
    {
      icon: <Icons.ScrollText className="h-6 w-6" />,
      title: "Acceptation des conditions",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            En utilisant GooxAlert, vous acceptez d'être lié par les présentes conditions d'utilisation. 
            Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
          </p>
          <div className="bg-primary-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Engagement</h4>
            <p className="text-gray-600">
              L'utilisation de GooxAlert implique votre engagement à respecter ces conditions et à contribuer 
              positivement à la communauté.
            </p>
          </div>
        </div>
      )
    },
    {
      icon: <Icons.Users className="h-6 w-6" />,
      title: "Utilisation du service",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <Icons.CheckCircle className="h-5 w-5 text-success-500 mb-2" />
              <h4 className="font-medium">Ce que vous pouvez faire</h4>
              <ul className="mt-2 space-y-2 text-gray-600">
                <li className="flex items-center">
                  <Icons.Check className="h-4 w-4 text-success-500 mr-2" />
                  Créer des signalements précis
                </li>
                <li className="flex items-center">
                  <Icons.Check className="h-4 w-4 text-success-500 mr-2" />
                  Partager des photos pertinentes
                </li>
                <li className="flex items-center">
                  <Icons.Check className="h-4 w-4 text-success-500 mr-2" />
                  Suivre l'évolution des problèmes
                </li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <Icons.XCircle className="h-5 w-5 text-error-500 mb-2" />
              <h4 className="font-medium">Ce qui est interdit</h4>
              <ul className="mt-2 space-y-2 text-gray-600">
                <li className="flex items-center">
                  <Icons.X className="h-4 w-4 text-error-500 mr-2" />
                  Faux signalements
                </li>
                <li className="flex items-center">
                  <Icons.X className="h-4 w-4 text-error-500 mr-2" />
                  Contenu inapproprié
                </li>
                <li className="flex items-center">
                  <Icons.X className="h-4 w-4 text-error-500 mr-2" />
                  Harcèlement d'autres utilisateurs
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: <Icons.Shield className="h-6 w-6" />,
      title: "Responsabilités",
      content: (
        <div className="space-y-4">
          <div className="bg-primary-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Vos responsabilités</h4>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <Icons.AlertCircle className="h-5 w-5 text-primary-500 mr-2" />
                Fournir des informations exactes et véridiques
              </li>
              <li className="flex items-center">
                <Icons.AlertCircle className="h-5 w-5 text-primary-500 mr-2" />
                Respecter la vie privée des autres
              </li>
              <li className="flex items-center">
                <Icons.AlertCircle className="h-5 w-5 text-primary-500 mr-2" />
                Signaler tout contenu inapproprié
              </li>
            </ul>
          </div>
          <div className="bg-primary-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Nos responsabilités</h4>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <Icons.Shield className="h-5 w-5 text-primary-500 mr-2" />
                Assurer la sécurité de vos données
              </li>
              <li className="flex items-center">
                <Icons.Shield className="h-5 w-5 text-primary-500 mr-2" />
                Modérer le contenu inapproprié
              </li>
              <li className="flex items-center">
                <Icons.Shield className="h-5 w-5 text-primary-500 mr-2" />
                Maintenir la qualité du service
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      icon: <Icons.Scale className="h-6 w-6" />,
      title: "Propriété intellectuelle",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Tout le contenu présent sur GooxAlert, y compris les textes, graphiques, logos, icônes, 
            images et logiciels, est la propriété de GooxAlert ou de ses fournisseurs de contenu.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Droits d'utilisation</h4>
            <p className="text-gray-600">
              Vous êtes autorisé à utiliser le service pour signaler des problèmes urbains et 
              participer à la communauté, dans le respect des présentes conditions.
            </p>
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
            <Icons.ScrollText className="h-16 w-16" />
          </div>
          <h1 className="text-4xl font-bold text-center mb-4">
            Conditions d'Utilisation
          </h1>
          <p className="text-xl text-center text-primary-100">
            Les règles qui encadrent l'utilisation de GooxAlert
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <p className="text-lg text-gray-700 mb-8">
            Bienvenue sur <span className="font-semibold text-primary-600">GooxAlert</span>. 
            Ces conditions d'utilisation définissent les règles et responsabilités liées à l'utilisation 
            de notre plateforme de signalement de problèmes urbains.
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
            <Icons.HelpCircle className="h-6 w-6 text-primary-500 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900">Questions ?</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Si vous avez des questions concernant nos conditions d'utilisation, n'hésitez pas à nous contacter.
          </p>
          <a 
            href="mailto:support@gooxalert.com" 
            className="inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            <Icons.Mail className="h-5 w-5 mr-2" />
            support@gooxalert.com
          </a>
        </div>

        {/* Navigation Links */}
        <div className="mt-8 flex justify-center space-x-8">
          <Link 
            to="/privacy" 
            className="inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            <Icons.Shield className="h-5 w-5 mr-2" />
            Politique de confidentialité
          </Link>
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

export default TermsPage; 