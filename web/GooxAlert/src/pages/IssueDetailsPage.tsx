import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, User, Image, Loader2 } from 'lucide-react';
import { formatDate } from '../utils/formatters';
import StatusBadge from '../components/issues/StatusBadge';
import CategoryIcon from '../components/issues/CategoryIcon';
import IssueMap from '../components/map/IssueMap';
import { useIssues } from "../contexts/IssueContext";
import { useAuth } from '../contexts/AuthContext';
import { Signalement } from '../types';

const IssueDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getIssueById, getIssue } = useIssues();
  const navigate = useNavigate();
  const [issue, setIssue] = useState<Signalement | undefined>(() => (id ? getIssueById(Number(id)) : undefined));
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchIssue = async () => {
      if (id) {
        try {
          setIsLoading(true);
          const fetchedIssue = await getIssue(Number(id));
          setIssue(fetchedIssue);
        } catch (error) {
          console.error('Error fetching issue:', error);
          navigate('/dashboard');
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (!issue && id) {
      fetchIssue();
    } else {
      setIsLoading(false);
    }
  }, [id, issue, getIssue, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
          <p className="text-gray-600">Chargement des détails...</p>
        </div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Signalement non trouvé</h2>
          <Link to="/dashboard" className="text-primary-600 hover:text-primary-700">
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    );
  }

  const [lat, lng] = issue.location.split(',').map(Number);

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-12 transition-all duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-8 transition-all duration-300 hover:shadow-md">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <Link
              to="/dashboard"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 text-sm sm:text-base transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Retour au tableau de bord
            </Link>
          </div>

          <div className="space-y-6 sm:space-y-8 animate-fadeIn">
            <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
              <div className="flex flex-wrap gap-3 sm:gap-4 mb-4">
                <StatusBadge status={issue.status as any} />
                <div className="flex items-center text-gray-600 text-sm bg-white px-3 py-1 rounded-full shadow-sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Signalé le {formatDate(issue.created_at)}</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm bg-white px-3 py-1 rounded-full shadow-sm">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="truncate max-w-[200px] sm:max-w-none">{user?.commune || 'Commune non spécifiée'}</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm bg-white px-3 py-1 rounded-full shadow-sm">
                  <User className="h-4 w-4 mr-2" />
                  <span>{user?.full_name}</span>
                </div>
                <div className="flex items-center text-sm bg-white px-3 py-1 rounded-full shadow-sm">
                  <CategoryIcon category={issue.category as any} />
                  <span className="text-gray-600 capitalize ml-2">{issue.category.replace('_', ' ')}</span>
                </div>
              </div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                {issue.title}
              </h1>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                {issue.description}
              </p>
            </div>

            <div className="relative group">
              {issue.image_url ? (
                <div className="overflow-hidden rounded-xl shadow-md transition-transform duration-300 group-hover:scale-[1.02]">
                  <img
                    src={issue.image_url}
                    alt="Image du signalement"
                    className="w-full h-48 sm:h-96 object-cover"
                  />
                </div>
              ) : (
                <div className="h-32 sm:h-48 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Image className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Localisation</h2>
              <div className="h-64 sm:h-96 rounded-xl overflow-hidden shadow-md">
                <IssueMap
                  center={[lat, lng]}
                  customMarkers={[{ position: [lat, lng] }]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetailsPage;