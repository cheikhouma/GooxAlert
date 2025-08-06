import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useIssues } from '../contexts/IssueContext';
import ImageUpload, { uploadImageToImgBB } from '../services/ImageSignalUpload';
import { Camera, Navigation } from 'lucide-react';


delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const initialPosition = { lat: 14.6928, lng: -17.4467 }; // Dakar

const CATEGORIES = [
  { value: 'voirie', label: 'Voirie' },
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'eclairage', label: 'Éclairage' },
  { value: 'ordures', label: 'Ordures' },
  { value: 'eau', label: 'Eau' },
  { value: 'nuisances', label: 'Nuisances' },
  { value: 'espaces_verts', label: 'Espaces verts' },
  { value: 'securite', label: 'Sécurité' },
  { value: 'signalisation', label: 'Signalisation' },
  { value: 'autre', label: 'Autre' },
];

// Composant pour gérer le centrage de la carte
const MapController = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center && map) {
      map.flyTo(center, map.getZoom(), {
        duration: 1.5,
        easeLinearity: 0.25
      });
    }
  }, [center, map]);

  return null;
};

const LocationPicker = ({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const TipsSection = () => (
  <div className="mt-8 bg-gray-50 rounded-lg p-4 border border-gray-200">
    <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
      <Camera className="w-5 h-5 mr-2 text-primary-600" />
      Conseils pour un bon signalement
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2">
      <li>Prenez une photo claire montrant bien le problème</li>
      <li>Soyez précis dans votre description</li>
      <li>Mentionnez depuis quand le problème existe, si vous le savez</li>
      <li>Indiquez s'il présente un danger pour les personnes</li>
      <li>Vérifiez que le problème n'a pas déjà été signalé en consultant la carte</li>
    </ul>
  </div>
);

type FormDataType = {
  title: string;
  description: string;
  category: string;
  imageFile: File | null;
  location: string;
};

const ReportIssueForm = () => {
  const navigate = useNavigate();
  const { addIssue } = useIssues();
  const [formData, setFormData] = useState<FormDataType>({
    title: '',
    description: '',
    category: '',
    imageFile: null,
    location: '',
  });

  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([initialPosition.lat, initialPosition.lng]);
  const [isLocating, setIsLocating] = useState(false);

  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newCenter: [number, number] = [latitude, longitude];
          setMapCenter(newCenter);
          setSelectedLocation(newCenter);
          setFormData(prev => ({ ...prev, location: `${latitude},${longitude}` }));
          setIsLocating(false);
          toast.success('Position actuelle détectée');
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error);
          setIsLocating(false);
          toast.error('Impossible d\'obtenir votre position. Veuillez sélectionner manuellement sur la carte.');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setIsLocating(false);
      toast.error('La géolocalisation n\'est pas supportée par votre navigateur');
    }
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation([lat, lng]);
    // Convertir les coordonnées en adresse (vous devrez implémenter cette fonction)
    setFormData(prev => ({ ...prev, location: `${lat},${lng}` }));
  };

  const handleImageSelected = (imageFile: File | null) => {
    setFormData(prev => ({ ...prev, imageFile }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
    const errors: Record<string, string> = {};

    if (!formData.title || formData.title.length < 5) errors.title = 'Le titre est requis (5 caractères minimum)';
    if (!formData.description || formData.description.length < 10) errors.description = 'La description est requise (10 caractères minimum)';
    if (!formData.category) errors.category = 'La catégorie est requise';
      if (!selectedLocation) errors.location = 'La position est requise';

    if (Object.keys(errors).length > 0) {
      throw new Error(JSON.stringify(errors));
    }

      let imageUrl = '';
      if (formData.imageFile) {
        try {
          imageUrl = await uploadImageToImgBB(formData.imageFile);
        } catch (error) {
          toast.error('Erreur lors de l\'upload de l\'image');
          setIsSubmitting(false);
        return;
      }
      }

      await addIssue({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        image_url: imageUrl,
        location: formData.location,
      });

      toast.success('Signalement créé avec succès !');
      navigate('/dashboard');
    } catch (error) {
      if (error instanceof Error) {
        try {
          const errors = JSON.parse(error.message);
          Object.entries(errors).forEach(([field, message]) => {
            toast.error(message as string);
          });
        } catch {
          toast.error('Une erreur est survenue lors de la création du signalement');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Signaler un problème</h2>
            <p className="text-gray-600">
              Votre signalement sera traité par les services compétents. Plus vous donnez de détails, plus il sera facile de résoudre le problème.
            </p>
            <TipsSection />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">Titre</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-primary-500 focus:border-primary-500"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">Catégorie</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="mt-1 block w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-primary-500 focus:border-primary-500"
                required
              >
                <option value="">Sélectionner une catégorie</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-700 mb-2">Photo du problème</label>
              <ImageUpload 
                currentImageUrl={formData.imageFile ? URL.createObjectURL(formData.imageFile) : ''} 
                onImageSelected={handleImageSelected} 
              />
              <p className="mt-2 text-sm text-gray-500">
                L'image sera uploadée uniquement lors de l'envoi du signalement
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-base font-semibold text-gray-700">
                  Localisation du problème
                </label>
              </div>
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                disabled={isLocating}
                className="inline-flex m-5 ml-0 border-2 border-primary-600 items-center px-3 py-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
              >
                <Navigation className={`w-4 h-4 mr-1.5 ${isLocating ? 'animate-spin' : ''}`} />
                {isLocating ? 'Localisation...' : 'Utiliser ma position'}
              </button>
              <MapContainer
                center={mapCenter}
                zoom={13}
                style={{ height: '300px', width: '100%' }}
                className="rounded-lg shadow-sm"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="© OpenStreetMap contributors"
                />
                <MapController center={mapCenter} />
                <LocationPicker onLocationSelect={handleLocationSelect} />
                {selectedLocation && (
                  <Marker position={selectedLocation} />
                )}
              </MapContainer>
              {selectedLocation && (
                <p className="mt-2 text-sm text-gray-500">
                  Position sélectionnée : {selectedLocation[0].toFixed(6)}, {selectedLocation[1].toFixed(6)}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium shadow-sm disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Envoi en cours…' : 'Envoyer le signalement'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportIssueForm;
