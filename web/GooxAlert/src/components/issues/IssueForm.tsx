import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, X } from 'lucide-react';
import { Issue, IssueCategory, Location } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import CategoryIcon from './CategoryIcon';
import {useIssues} from "../../contexts/IssueContext.tsx";

const CATEGORIES: { value: IssueCategory; label: string }[] = [
  { value: 'lighting', label: 'Éclairage' },
  { value: 'waste', label: 'Déchets' },
  { value: 'road', label: 'Voirie' },
  { value: 'water', label: 'Eau' },
  { value: 'electricity', label: 'Électricité' },
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'other', label: 'Autre' }
];

interface IssueFormProps {
  initialLocation?: Location;
}

const IssueForm: React.FC<IssueFormProps> = ({ initialLocation }) => {
  const { user } = useAuth();
  const { addIssue } = useIssues();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IssueCategory>('other');
  const [location, setLocation] = useState<Location>(initialLocation || {
    lat: 14.7167,
    lng: -17.4677,
    address: 'Dakar, Sénégal'
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    setLoading(true);
    
    try {
      const newIssue = await addIssue({
        title,
        description,
        category,
        location,
        imageUrl: imagePreview || undefined,
        userId: user.id,
        upvotes: 0,
        upvotedBy: [],
        comments: [],
      });
      
      // Navigate to the issue details page
      navigate(`/issues/${newIssue.id}`);
    } catch (error) {
      console.error('Failed to create issue:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="label">Titre</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input"
          placeholder="Exemple: Lampadaire cassé sur l'avenue de la République"
          required
        />
      </div>
      
      <div>
        <label htmlFor="category" className="label">Catégorie</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setCategory(cat.value)}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-colors ${
                category === cat.value
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <CategoryIcon category={cat.value} className="w-6 h-6 mb-2" />
              <span className="text-sm">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label htmlFor="description" className="label">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input min-h-24"
          placeholder="Décrivez le problème avec le plus de détails possible..."
          required
        />
      </div>
      
      <div>
        <label htmlFor="location" className="label flex items-center">
          <MapPin className="w-5 h-5 mr-1" />
          Emplacement
        </label>
        <div className="text-sm text-gray-500 mb-2">
          {location.address || `${location.lat}, ${location.lng}`}
        </div>
        <p className="text-xs text-gray-500">
          Note: La localisation actuelle sera utilisée. Dans une version ultérieure, vous pourrez sélectionner l'emplacement sur la carte.
        </p>
      </div>
      
      <div>
        <label htmlFor="image" className="label">Photo</label>
        <div className="mt-1 flex items-center">
          {imagePreview ? (
            <div className="relative">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="h-32 w-32 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center h-32 w-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 text-gray-400 hover:text-gray-500 transition-colors"
            >
              <Camera className="w-6 h-6" />
            </button>
          )}
          <input
            ref={fileInputRef}
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Ajouter une photo aide à mieux comprendre le problème. Format: JPG, PNG (max 5MB)
        </p>
      </div>
      
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn btn-outline"
          disabled={loading}
        >
          Annuler
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
              Envoi...
            </div>
          ) : (
            'Soumettre le signalement'
          )}
        </button>
      </div>
    </form>
  );
};

export default IssueForm;