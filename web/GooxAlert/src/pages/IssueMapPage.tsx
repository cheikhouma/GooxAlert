import { useState } from 'react';
import IssueMap from '../components/map/IssueMap';
import SignalementList from '../components/issues/SignalementList';
import { MapPin, List, LogIn } from 'lucide-react';
import { useIssues } from '../contexts/IssueContext';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const IssueMapPage = () => {
  const { issues, loading, error } = useIssues();
  const { user } = useAuth();
  const [view, setView] = useState<'map' | 'list'>('map');

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <LogIn className="mx-auto mb-4 w-12 h-12 text-gray-400" />
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Connexion requise</h2>
        <p className="text-gray-600 mb-4">
          Vous devez être connecté pour signaler un problème ou voir vos signalements sur la carte.
        </p>
        <Link 
          to="/login" 
          className="inline-block px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
        >
          Se connecter
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="text-red-500 mb-4">Une erreur est survenue lors du chargement des signalements</div>
        <button 
          onClick={() => window.location.reload()} 
          className="text-primary-600 hover:text-primary-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Carte des signalements</h1>
        <p className="text-gray-600 max-w-3xl">
          Explorez les problèmes urbains signalés par les citoyens à travers Dakar. Visualisez leur emplacement et leur statut.
        </p>
      </div>
      
      <div className="mb-6 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {issues.length} signalements au total
        </div>
        
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setView('map')}
            className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
              view === 'map' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <MapPin className="w-4 h-4 mr-1.5" />
            Carte
          </button>
          <button
            onClick={() => setView('list')}
            className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
              view === 'list' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <List className="w-4 h-4 mr-1.5" />
            Liste
          </button>
        </div>
      </div>
      
      {view === 'map' ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <IssueMap issues={issues} height="600px" />
        </div>
      ) : (
        <SignalementList 
          signalements={issues} 
          title="Tous les signalements" 
          showFilters={true}
        />
      )}
    </div>
  );
};

export default IssueMapPage;
