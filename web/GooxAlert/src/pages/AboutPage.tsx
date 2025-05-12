import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';

const AboutPage = () => {
  const features = [
    {
      icon: <Icons.MapPin className="h-6 w-6" />,
      title: "Signalement Local",
      description: "Signalez facilement les problèmes urbains dans votre quartier"
    },
    {
      icon: <Icons.Users className="h-6 w-6" />,
      title: "Communauté Active",
      description: "Rejoignez une communauté engagée pour améliorer votre ville"
    },
    {
      icon: <Icons.Bell className="h-6 w-6" />,
      title: "Suivi en Temps Réel",
      description: "Suivez l'évolution de vos signalements en temps réel"
    },
    {
      icon: <Icons.Shield className="h-6 w-6" />,
      title: "Sécurité Garantie",
      description: "Vos données sont protégées et sécurisées"
    }
  ];

  const team = [
    {
      name: "Cheikh Oumar DIALLO",
      role: "Fondateur & CEO",
      image: "https://th.bing.com/th/id/OIP.h2LAtVRnW5Rd3LxYy5MWtwAAAA?w=175&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
      description: "Passionné par l'innovation urbaine et la technologie citoyenne"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-8">
            <Icons.MapPin className="h-16 w-16" />
          </div>
          <h1 className="text-4xl font-bold text-center mb-4">
            À Propos de GooxAlert
          </h1>
          <p className="text-xl text-center text-primary-100">
            Votre partenaire pour une ville plus intelligente et plus agréable
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="flex items-center mb-6">
            <Icons.Target className="h-8 w-8 text-primary-500 mr-4" />
            <h2 className="text-2xl font-semibold text-gray-900">Notre Mission</h2>
          </div>
          <p className="text-lg text-gray-700 mb-6">
            GooxAlert est né d'une vision simple : rendre les villes plus intelligentes et plus agréables 
            à vivre en donnant aux citoyens les moyens de signaler et de suivre les problèmes urbains. 
            Notre plateforme connecte les citoyens, les autorités locales et les services municipaux 
            pour une meilleure gestion de l'espace public.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-primary-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="bg-primary-100 p-2 rounded-lg mr-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="flex items-center mb-6">
            <Icons.Users className="h-8 w-8 text-primary-500 mr-4" />
            <h2 className="text-2xl font-semibold text-gray-900">Notre Équipe</h2>
          </div>
          <p className="text-lg text-gray-700 mb-8">
            Une équipe passionnée qui travaille chaque jour pour améliorer votre expérience et 
            rendre votre ville plus agréable à vivre.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                <p className="text-primary-600 mb-2">{member.role}</p>
                <p className="text-gray-600">{member.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="flex items-center mb-6">
            <Icons.Heart className="h-8 w-8 text-primary-500 mr-4" />
            <h2 className="text-2xl font-semibold text-gray-900">Nos Valeurs</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <Icons.Users className="h-6 w-6 text-primary-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Engagement Citoyen</h3>
              <p className="text-gray-600">
                Nous croyons en la puissance de l'action collective pour améliorer notre environnement.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <Icons.Shield className="h-6 w-6 text-primary-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Transparence</h3>
              <p className="text-gray-600">
                Nous nous engageons à être transparents dans nos actions et nos communications.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <Icons.Zap className="h-6 w-6 text-primary-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Innovation</h3>
              <p className="text-gray-600">
                Nous cherchons constamment à améliorer notre service grâce à l'innovation.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary-600 rounded-2xl shadow-sm p-8 text-center">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Rejoignez la communauté GooxAlert
          </h2>
          <p className="text-primary-100 mb-6">
            Contribuez à l'amélioration de votre ville en signalant les problèmes et en suivant leur résolution.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/register"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50"
            >
              <Icons.UserPlus className="h-5 w-5 mr-2" />
              Créer un compte
            </Link>
            <Link
              to="/map"
              className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-primary-700"
            >
              <Icons.Map className="h-5 w-5 mr-2" />
              Voir la carte
            </Link>
          </div>
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

export default AboutPage; 