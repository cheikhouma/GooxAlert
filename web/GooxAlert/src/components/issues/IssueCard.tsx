import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Image } from 'lucide-react';
import { Issue } from '../../types';
import { formatDate } from '../../utils/formatters';
import StatusBadge from './StatusBadge';
import CategoryIcon from './CategoryIcon';


interface IssueCardProps {
  issue: Issue;
  showActions?: boolean;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue }) => {
    

  return (
    <Link to={`/issues/${issue.id}`} className="block">
      <div className="card hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-48 overflow-hidden bg-gray-100">
          {issue.imageUrl ? (
            <img 
              src={issue.imageUrl} 
              alt={issue.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Image className="w-12 h-12" />
            </div>
          )}
          <div className="absolute top-2 right-2">
            <StatusBadge status={issue.status} />
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-center mb-2">
            <CategoryIcon category={issue.category} className="w-5 h-5 mr-2" />
            <span className="text-sm text-gray-600 capitalize">{issue.category.replace('_', ' ')}</span>
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-2">{issue.title}</h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {issue.description}
          </p>
          
          <div className="flex flex-wrap text-xs text-gray-500 gap-y-2">
            <div className="flex items-center mr-4">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{formatDate(issue.createdAt)}</span>
            </div>
            
            <div className="flex items-center mr-4">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{issue.location.address || 'Dakar'}</span>
            </div>
            
            
            
            
            
         
          </div>
        </div>
      </div>
    </Link>
  );
};

export default IssueCard;