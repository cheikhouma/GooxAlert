import { Link } from 'react-router-dom';
import { MapPin, BarChart, CheckCircle, Users, ArrowRight, LogIn } from 'lucide-react';
import { useIssues } from "../contexts/IssueContext.tsx";
import { useAuth } from '../contexts/AuthContext.tsx';

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();

  const { issues } = useIssues();
  const recentIssues = [...issues]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="md:w-2/3">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
              Améliorez Dakar ensemble
            </h1>
            <p className="text-xl mb-8 text-primary-50">
              Signalez les problèmes urbains, suivez leur résolution et contribuez à l'amélioration de votre cadre de vie.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/report"
                className="inline-flex items-center bg-white text-primary-700 hover:bg-primary-50 px-6 py-3 rounded-lg font-medium shadow-lg transition-colors"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Signaler un problème
              </Link>
              <Link
                to="/map"
                className="inline-flex items-center bg-primary-700 text-white hover:bg-primary-800 px-6 py-3 rounded-lg font-medium border border-primary-500 transition-colors"
              >
                Voir la carte
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120">
            <path
              fill="#F9FAFB"
              fillOpacity="1"
              d="M0,32L60,53.3C120,75,240,117,360,122.7C480,128,600,96,720,80C840,64,960,64,1080,69.3C1200,75,1320,85,1380,90.7L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">L'impact citoyen en chiffres</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Ensemble, nous construisons une ville plus réactive et mieux entretenue.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="flex justify-center mb-4">
                <MapPin className="w-10 h-10 text-primary-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {issues.length}
              </div>
              <div className="text-gray-600">Signalements soumis</div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="flex justify-center mb-4">
                <BarChart className="w-10 h-10 text-secondary-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {issues.filter(i => i.status === 'in_progress').length}
              </div>
              <div className="text-gray-600">Problèmes en cours</div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-success-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {issues.filter(i => i.status === 'resolved').length}
              </div>
              <div className="text-gray-600">Problèmes résolus</div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="flex justify-center mb-4">
                <Users className="w-10 h-10 text-accent-600" />
              </div>

              <div className="text-gray-600">Citoyens actifs</div>
            </div>
          </div>
        </div>
      </section>


      {/* Recent Issues Section */}
      {isAuthenticated && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Signalements récents</h2>
              <Link
                to="/map"
                className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
              >
                Voir tous mes signalements
                <ArrowRight className="ml-1 w-5 h-5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentIssues
                .filter((issue) => issue.userId === user?.id)
                .map((issue) => (
                  <Link key={issue.id} to={`/issues/${issue.id}`} className="block">
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                      {issue.imageUrl && (
                        <img
                          src={issue.imageUrl}
                          alt={issue.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-1">{issue.title}</h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {issue.description}
                        </p>
                        <div className="flex justify-between items-center text-sm">
                          <span className="capitalize text-gray-500">
                            {issue.category.replace('_', ' ')}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${issue.status === 'pending' ? 'bg-warning-100 text-warning-800' :
                              issue.status === 'in_progress' ? 'bg-secondary-100 text-secondary-800' :
                                issue.status === 'resolved' ? 'bg-success-100 text-success-800' :
                                  'bg-error-100 text-error-800'
                            }`}>
                            {issue.status === 'pending' ? 'En attente' :
                              issue.status === 'in_progress' ? 'En cours' :
                                issue.status === 'resolved' ? 'Résolu' : 'Rejeté'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>)
      }
      {!isAuthenticated && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className=" justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Signalements récents</h2>

              <div className="max-w-2xl mx-auto px-4 py-12 text-center">
                <LogIn className="mx-auto mb-4 w-12 h-12 text-gray-400" />
                <h2 className="text-xl font-semibold mb-2 text-gray-800">Connexion requise</h2>
                <p className="text-gray-600 mb-4">
                  Vous devez être connecté pour signaler un problème ou voir vos signalements recents.
                </p>
                <Link
                  to="/login"
                  className="inline-block px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
                >
                  Se connecter
                </Link>
              </div>
            </div>
          </div>
        </section>

      )}

      {/* How It Works Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Comment ça marche ?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Smart Dakar vous permet de signaler facilement les problèmes urbains et de suivre leur résolution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3 mt-4">Signaler</h3>
              <p className="text-gray-600">
                Prenez une photo du problème urbain, indiquez sa localisation et décrivez-le brièvement.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3 mt-4">Suivre</h3>
              <p className="text-gray-600">
                Consultez l'état d'avancement de votre signalement et recevez des notifications sur son traitement.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3 mt-4">Célébrer</h3>
              <p className="text-gray-600">
                Félicitez-vous d'avoir contribué à l'amélioration de votre cadre de vie et de celui de vos concitoyens.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      {(!isAuthenticated) && (
        <section className="py-16 bg-primary-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Prêt à améliorer Dakar ?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto text-primary-50">
              Rejoignez notre communauté de citoyens engagés et participez activement à l'amélioration de votre ville.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center bg-white text-primary-700 hover:bg-primary-50 px-6 py-3 rounded-lg font-medium shadow-lg transition-colors"
              >
                Créer un compte
              </Link>
              <Link
                to="/report"
                className="inline-flex items-center bg-primary-700 text-white hover:bg-primary-800 px-6 py-3 rounded-lg font-medium border border-primary-500 transition-colors"
              >
                Signaler un problème
              </Link>
            </div>
          </div>
        </section>)}
    </div>
  );
};

export default HomePage;