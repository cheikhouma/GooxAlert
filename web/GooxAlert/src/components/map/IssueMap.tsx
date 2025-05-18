import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Issue } from '../../types';
import { Link } from 'react-router-dom';
import CategoryIcon from '../issues/CategoryIcon';
import StatusBadge from '../issues/StatusBadge';
import { useAuth } from '../../contexts/AuthContext';

interface IssueMapProps {
  issues?: Issue[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  selectedId?: string;
  customMarkers?: Array<{ position: [number, number] }>;
  showAllIssues?: boolean;
}

const IssueMap: React.FC<IssueMapProps> = ({ 
  issues = [], 
  center = [14.7167, -17.4677], // Default center: Dakar
  zoom = 12,
  height = '500px',
  selectedId,
  customMarkers = [],
  showAllIssues = false
}) => {
  const { user } = useAuth(); 
  const displayIssues = useMemo(() => 
    showAllIssues ? issues : issues.filter(issue => issue.userId === user?.id),
    [issues, user?.id, showAllIssues]
  );

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'lighting': return 'yellow-500';
      case 'waste': return 'green-500';
      case 'road': return 'gray-500';
      case 'water': return 'blue-500';
      case 'electricity': return 'orange-500';
      case 'infrastructure': return 'indigo-500';
      default: return 'gray-500';
    }
  };

  const getCategoryIconSvg = (category: string) => {
    // This is a simplified approach; in a real app, you might want to use actual SVG code
    switch(category) {
      case 'lighting': return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path><path d="M9 18h6"></path><path d="M10 22h4"></path></svg>';
      case 'waste': return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>';
      case 'road': return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 4v16"></path><path d="M6 4v16"></path><path d="M12 4v4"></path><path d="M12 16v4"></path><path d="M12 10v4"></path></svg>';
      case 'water': return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path></svg>';
      case 'electricity': return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 L3 14 h9 l-1 8 l10 -12 h-9 l1 -8"></path></svg>';
      case 'infrastructure': return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path></svg>';
      default: return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
    }
  };

  const createMarkerIcon = (category: string, selected: boolean = false) => {
    return L.divIcon({
      className: `issue-marker issue-marker-${category} ${selected ? 'selected' : ''}`,
      html: `<div class="marker-icon bg-white p-1 rounded-full shadow-lg ${selected ? 'ring-2 ring-primary-500' : ''}">
              <div class="icon-wrapper text-${getCategoryColor(category)}">
                ${getCategoryIconSvg(category)}
              </div>
            </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
  };

  const markers = useMemo(() => {
    const newMarkers: {[key: string]: L.DivIcon} = {};
    displayIssues.forEach(issue => {
      const isSelected = issue.id === selectedId;
      newMarkers[`${issue.id}-${issue.category}-${isSelected}`] = createMarkerIcon(issue.category, isSelected);
    });
    return newMarkers;
  }, [displayIssues, selectedId]);

  return (
    <div style={{ height }}>
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {customMarkers.map((marker, index) => (
          <Marker 
            key={`custom-${index}`}
            position={marker.position}
          />
        ))}
        
        {displayIssues.map(issue => {
          const markerKey = `${issue.id}-${issue.category}-${issue.id === selectedId}`;
          if (markers[markerKey]) {
            return (
              <Marker 
                key={issue.id}
                position={[issue.location.lat, issue.location.lng]}
                icon={markers[markerKey]}
              >
                <Popup>
                  <div className="w-64 p-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <CategoryIcon category={issue.category} className="w-4 h-4 mr-1" />
                        <span className="text-xs text-gray-600 capitalize">{issue.category.replace('_', ' ')}</span>
                      </div>
                      <StatusBadge status={issue.status} size="sm" />
                    </div>
                    
                    <h3 className="text-sm font-medium mb-1">{issue.title}</h3>
                    
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {issue.description}
                    </p>
                    
                    <Link 
                      to={`/issues/${issue.id}`} 
                      className="text-xs text-primary-600 hover:text-primary-800 font-medium"
                    >
                      Voir les détails
                    </Link>
                  </div>
                </Popup>
              </Marker>
            );
          }
          return null;
        })}
      </MapContainer>
    </div>
  );
};

export default IssueMap;