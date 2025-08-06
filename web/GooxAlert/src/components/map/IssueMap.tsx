import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L, { LeafletEvent } from 'leaflet';
import { Signalement, IssueCategory } from '../../types';
import { Link } from 'react-router-dom';
import CategoryIcon from '../issues/CategoryIcon';
import StatusBadge from '../issues/StatusBadge';
import { useAuth } from '../../contexts/AuthContext';
import 'leaflet/dist/leaflet.css';

// Correction des icônes Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Configuration de l'icône par défaut
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Appliquer l'icône par défaut à tous les marqueurs
L.Marker.prototype.options.icon = DefaultIcon;

interface IssueMapProps {
  issues?: Signalement[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  selectedId?: number;
  customMarkers?: Array<{ position: [number, number] }>;
  showAllIssues?: boolean;
}

// Composant pour gérer le centrage de la carte
const MapController = React.memo(({ center }: { center: [number, number] }) => {
  const map = useMap();
  const prevCenter = useRef(center);
  const isAnimating = useRef(false);
  
  useEffect(() => {
    if (!center || !map || isAnimating.current) return;
    
    const [prevLat, prevLng] = prevCenter.current;
    const [newLat, newLng] = center;
    
    // Ne faire l'animation que si le changement est significatif
    if (Math.abs(prevLat - newLat) > 0.0001 || Math.abs(prevLng - newLng) > 0.0001) {
      isAnimating.current = true;
      map.flyTo(center, map.getZoom(), {
        duration: 1.5,
        easeLinearity: 0.25
      });
      
      // Utiliser setTimeout pour gérer la fin de l'animation
      setTimeout(() => {
        isAnimating.current = false;
      }, 1500);
      
      prevCenter.current = center;
    }
  }, [center, map]);

  return null;
});

MapController.displayName = 'MapController';

const IssueMap: React.FC<IssueMapProps> = React.memo(({ 
  issues = [], 
  center = [14.7167, -17.4677], // Default center: Dakar
  zoom = 12,
  height = '500px',
  selectedId,
  customMarkers = [],
  showAllIssues = false
}) => {
  const { user } = useAuth();
  const [mapError, setMapError] = useState<string | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const errorHandlerRef = useRef<((e: Event) => void) | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Mémoisation des issues à afficher
  const displayIssues = useMemo(() => 
    showAllIssues ? issues : issues,
    [issues, showAllIssues]
  );

  // Cache pour les icônes de marqueurs
  const markerIconsCache = useMemo(() => new Map<string, L.Icon>(), []);

  // Création des icônes de marqueurs avec gestion d'erreur
  const createMarkerIcon = useCallback((category: IssueCategory, selected: boolean = false) => {
    const iconKey = `${category}-${selected}`;
    if (!markerIconsCache.has(iconKey)) {
      try {
        const markerIcon = L.icon({
          iconUrl: icon,
          shadowUrl: iconShadow,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
          className: `issue-marker issue-marker-${category} ${selected ? 'selected' : ''}`
        });
        markerIconsCache.set(iconKey, markerIcon);
        return markerIcon;
      } catch (error) {
        console.error('Error creating marker icon:', error);
        return DefaultIcon;
      }
    }
    return markerIconsCache.get(iconKey)!;
  }, [markerIconsCache]);

  // Mémoisation des marqueurs
  const markers = useMemo(() => {
    const newMarkers: {[key: string]: L.Icon} = {};
    displayIssues.forEach(issue => {
      try {
        const isSelected = issue.id === selectedId;
        const markerKey = `${issue.id}-${issue.category}-${isSelected}`;
        newMarkers[markerKey] = createMarkerIcon(issue.category as IssueCategory, isSelected);
      } catch (error) {
        console.error('Error creating marker for issue:', issue.id, error);
      }
    });
    return newMarkers;
  }, [displayIssues, selectedId, createMarkerIcon]);

  // Gestion des erreurs de la carte
  const handleMapError = useCallback((event: Event) => {
    if (!mountedRef.current) return;
    
    console.error('Map error:', event);
    if (!mapError) {
      setMapError('Une erreur est survenue lors du chargement de la carte');
    }
  }, [mapError]);

  // Nettoyage des écouteurs d'événements
  useEffect(() => {
    return () => {
      if (errorHandlerRef.current) {
        const map = document.querySelector('.leaflet-container');
        if (map) {
          map.removeEventListener('error', errorHandlerRef.current);
        }
      }
    };
  }, []);

  // Gestion du chargement de la carte
  const handleMapReady = useCallback(() => {
    if (!mountedRef.current) return;
    
    if (mapError) {
      setMapError(null);
    }
    
    const map = document.querySelector('.leaflet-container');
    if (map && !errorHandlerRef.current) {
      errorHandlerRef.current = handleMapError;
      map.addEventListener('error', errorHandlerRef.current);
    }
  }, [mapError, handleMapError]);

  if (mapError) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center p-4">
          <p className="text-red-600 mb-2">{mapError}</p>
          <button 
            onClick={() => {
              if (!mountedRef.current) return;
              setMapError(null);
              if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
              }
            }}
            className="text-primary-600 hover:text-primary-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height }} className="relative">
      <MapContainer 
        center={center as [number, number]} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        whenReady={handleMapReady}
        ref={(map) => {
          if (map) {
            mapRef.current = map;
          }
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController center={center as [number, number]} />
        
        {customMarkers.map((marker, index) => (
          <Marker 
            key={`custom-${index}`}
            position={marker.position as [number, number]}
            icon={DefaultIcon}
          />
        ))}
        
        {displayIssues.map(issue => {
          try {
            const [lat, lng] = issue.location.split(',').map(Number);
            if (isNaN(lat) || isNaN(lng)) {
              console.error('Invalid coordinates for issue:', issue.id);
              return null;
            }

            const isSelected = issue.id === selectedId;
            const markerIcon = createMarkerIcon(issue.category as IssueCategory, isSelected);

            return (
              <Marker 
                key={issue.id}
                position={[lat, lng] as [number, number]}
                icon={markerIcon}
                eventHandlers={{
                  click: (e) => {
                    L.DomEvent.stopPropagation(e);
                  }
                }}
              >
                <Popup
                  closeButton={true}
                  closeOnClick={false}
                  className="issue-popup"
                >
                  <div className="w-64 p-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <CategoryIcon category={issue.category as IssueCategory} className="w-4 h-4 mr-1" />
                        <span className="text-xs text-gray-600 capitalize">
                          {issue.category.replace('_', ' ')}
                        </span>
                      </div>
                      <StatusBadge status={issue.status as any} size="sm" />
                    </div>
                    
                    <h3 className="text-sm font-medium mb-1">{issue.title}</h3>
                    
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {issue.description}
                    </p>
                    
                    <Link 
                      to={`/issues/${issue.id}`}
                      className="text-xs text-primary-600 hover:text-primary-800 font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      Voir les détails
                    </Link>
                  </div>
                </Popup>
              </Marker>
            );
          } catch (error) {
            console.error('Error rendering marker for issue:', issue.id, error);
            return null;
          }
        })}
      </MapContainer>
    </div>
  );
});

IssueMap.displayName = 'IssueMap';

export default IssueMap;