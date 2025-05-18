import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, User, Image } from 'lucide-react';
import { formatDate } from '../utils/formatters';
import StatusBadge from '../components/issues/StatusBadge';
import CategoryIcon from '../components/issues/CategoryIcon';
import IssueMap from '../components/map/IssueMap';
import { useIssues } from "../contexts/IssueContext";
import { useAuth } from '../contexts/AuthContext';
import { Issue } from '../types';

const IssueDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getIssueById } = useIssues();
  const navigate = useNavigate();
  const [issue, setIssue] = useState<Issue | undefined>(id ? getIssueById(id) : undefined);
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      const fetchedIssue = getIssueById(id);
      if (fetchedIssue) {
        setIssue(fetchedIssue as Issue);
      } else {
        navigate('/dashboard');
      }
    }
  }, [id, getIssueById, navigate]);

  if (!issue) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-8">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <Link
              to="/dashboard"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 text-sm sm:text-base"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Retour au tableau de bord
            </Link>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <div>
              <div className="flex flex-wrap gap-3 sm:gap-4 mb-4">
                <StatusBadge status={issue.status} />
                <div className="flex items-center text-gray-600 text-sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    Signalé le {formatDate(issue.createdAt)}
                  </span>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="truncate max-w-[200px] sm:max-w-none">{issue.location.address}</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <User className="h-4 w-4 mr-2" />
                  <span>{user?.name}</span>
                </div>
                <div className="flex items-center text-sm">
                  <CategoryIcon category={issue.category} />
                  <span className="text-gray-600 capitalize ml-2">{issue.category.replace('_', ' ')}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  {issue.title}
                </h1>
              </div>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 text-sm sm:text-base">{issue.description}</p>
            </div>

            {issue.imageUrl ? (
              <div className="mb-4">
                <img
                  src={issue.imageUrl}
                  alt="Image du signalement"
                  className="w-full h-48 sm:h-96 object-cover rounded-lg shadow"
                />
              </div>
            ) : (
              <div className="mb-4 h-32 sm:h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                <Image className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
              </div>
            )}

            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Localisation</h2>
              <div className="h-64 sm:h-96 rounded-lg overflow-hidden">
                <IssueMap
                  center={[issue.location.lat, issue.location.lng]}
                  customMarkers={[{ position: [issue.location.lat, issue.location.lng] }]}
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