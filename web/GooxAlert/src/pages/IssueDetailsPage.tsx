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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <Link
              to="/dashboard"
              className="inline-flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Retour au tableau de bord
            </Link>
          </div>

          <div className="space-y-8">
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <StatusBadge status={issue.status} />
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-sm">
                    Signalé le {formatDate(issue.createdAt)}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="text-sm">{issue.location.address}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <User className="h-4 w-4 mr-2" />
                  <span className="text-sm">{user?.name}</span>
                </div>
                <div className="flex items-center">
                  <CategoryIcon category={issue.category} />
                  <span className="text-sm text-gray-600 capitalize">{issue.category.replace('_', ' ')}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                  {issue.title}
                </h1>
              </div>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700">{issue.description}</p>
            </div>

            {issue.imageUrl ? (
              <div className="mb-4">
                <img
                  src={issue.imageUrl}
                  alt="Image du signalement"
                  className="w-full max-h-96 object-cover rounded-lg shadow"
                />
              </div>
            ) : (
              <div className="mb-4 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                <Image className="w-16 h-16 text-gray-400" />
              </div>
            )}

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Localisation</h2>
              <div className="h-96 rounded-lg overflow-hidden">
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