import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Image, Clock } from 'lucide-react';
import { Signalement, IssueCategory } from '../../types';
import { formatDate } from '../../utils/formatters';
import StatusBadge from './StatusBadge';
import CategoryIcon from './CategoryIcon';
import { useAuth } from '../../contexts/AuthContext';

interface SignalementCardProps {
  signalement: Signalement;
}

const SignalementCard: React.FC<SignalementCardProps> = ({ signalement }) => {
  const { user } = useAuth();

  return (
    <Link to={`/issues/${signalement.id}`} className="block">
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4">
        {signalement.image_url && (
          <div className="aspect-video mb-4 rounded-lg overflow-hidden">
            <img 
              src={signalement.image_url} 
              alt={signalement.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CategoryIcon category={signalement.category as IssueCategory} className="w-5 h-5" />
            <span className="text-sm font-medium text-gray-600">
              {signalement.category}
            </span>
          </div>
          
          <h3 className="font-medium text-gray-900 line-clamp-2">
            {signalement.title}
          </h3>
          
          <p className="text-sm text-gray-600 line-clamp-2">
            {signalement.description}
          </p>
          
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="truncate">{user?.commune}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{new Date(signalement.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SignalementCard;