import { useAuth } from '../contexts/AuthContext';
import SignalementList from '../components/issues/SignalementList';
import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIssues } from "../contexts/IssueContext";

const DashboardPage = () => {
  const { user } = useAuth();
  const { userIssues } = useIssues();

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600">Gérez vos signalements</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link 
            to="/signaler" 
            className="inline-flex items-center bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-md font-medium transition-colors"
          >
            <MapPin className="w-5 h-5 mr-2" />
            Nouveau signalement
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Statistiques</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Signalements créés</span>
                  <span className="font-medium">{userIssues.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full" 
                    style={{ width: `${Math.min(100, (userIssues.length / 10) * 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Problèmes résolus</span>
                  <span className="font-medium">
                    {userIssues.filter(issue => issue.status === 'resolved').length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-success-600 h-2 rounded-full" 
                    style={{ 
                      width: `${Math.min(100, (userIssues.filter(issue => issue.status === 'resolved').length / Math.max(1, userIssues.length)) * 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-3">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Mes signalements</h2>
            <p className="text-gray-600">
              Consultez et gérez tous vos signalements
            </p>
          </div>
          
          <SignalementList 
            signalements={userIssues} 
            title="" 
            emptyMessage="Vous n'avez pas encore créé de signalement."
            showFilters={false}
          />
          
          {userIssues.length === 0 && (
            <div className="mt-4 text-center">
              <Link 
                to="/signaler" 
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Créer votre premier signalement
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;