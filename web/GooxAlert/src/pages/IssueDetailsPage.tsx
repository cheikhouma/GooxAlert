import  { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, User } from 'lucide-react';
import { formatDate } from '../utils/formatters';
import StatusBadge from '../components/issues/StatusBadge';
import CategoryIcon from '../components/issues/CategoryIcon';
import IssueMap from '../components/map/IssueMap';
import {useIssues} from "../contexts/IssueContext.tsx";

const IssueDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getIssueById } = useIssues();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(id ? getIssueById(id) : undefined);

  useEffect(() => {
    if (id) {
      const issueData = getIssueById(id);
      setIssue(issueData);
      
      if (!issueData) {
        // Issue not found, redirect to issues list
        navigate('/map', { replace: true });
      }
    }
  }, [id, getIssueById, navigate]);

  if (!issue) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/map" className="inline-flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Retour à la carte
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
            <div>
              <div className="flex items-center mb-2">
                <CategoryIcon category={issue.category} className="w-5 h-5 mr-2" />
                <span className="text-sm text-gray-600 capitalize">{issue.category.replace('_', ' ')}</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{issue.title}</h1>
            </div>
            
            <StatusBadge status={issue.status} size="lg" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <div className="prose max-w-none mb-6">
                <p className="text-gray-700">{issue.description}</p>
              </div>
              
              <div className="flex flex-wrap text-sm text-gray-500 gap-y-2 gap-x-4">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1.5" />
                  <span>Signalé le {formatDate(issue.createdAt)}</span>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1.5" />
                  <span>{issue.location.address || 'Dakar'}</span>
                </div>
                
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1.5" />
                  <span>Signalé par vous</span>
                </div>
                
                
              </div>
              
              
            </div>
            
            <div>
              {issue.imageUrl ? (
                <div className="rounded-lg overflow-hidden shadow-sm mb-4">
                  <img 
                    src={issue.imageUrl} 
                    alt={issue.title} 
                    className="w-full h-auto"
                  />
                </div>
              ) : null}
              
              <div className="rounded-lg overflow-hidden shadow-sm h-48">
                <IssueMap 
                  issues={[issue]} 
                  center={[issue.location.lat, issue.location.lng]} 
                  zoom={15}
                  height="100%"
                  selectedId={issue.id}
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