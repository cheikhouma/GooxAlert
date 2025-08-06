import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Save, X, User, Phone, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from '../services/profileService';
import { toast } from 'react-hot-toast';
import { UpdateProfileData, ApiResponse } from '../types/index';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { validatePhone, validateName, validateCommune } from '../utils/validation';
import ImageUpload from '../services/ImageUpload';


const COMMUNES = [
  'Dakar',
  'Guédiawaye',
  'Pikine',
  'Rufisque',
  'Thiès',
  'Touba',
  'Saint-Louis',
  'Kaolack'
];

// Constants
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || '49a117f96f4b6126c8c616a07f23eb06';

const EditProfilePage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateProfileData>({
    full_name: user?.full_name || '',
    telephone: user?.telephone || '',
    commune: user?.commune || '',
    image_url: user?.image_url,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedImage, setSelectedImage] = useState<{ file: File; previewUrl: string } | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        telephone: user.telephone || '',
        commune: user.commune || '',
        image_url: user.image_url || '',
      });
    }
  }, [user]);

  if (!user) {
    return null;
  }

  // Validation du formulaire
  const validateForm = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    if (!formData.full_name || formData.full_name.length < 2) {
      newErrors.full_name = 'Le nom complet doit contenir au moins 2 caractères';
    }

    if (formData.telephone) {
      // Nettoyer le numéro de téléphone
      const cleanPhone = formData.telephone.replace(/\s+/g, '');
      
      // Accepter les formats suivants :
      // - +221 7x xxxx xxx
      // - 00221 7x xxxx xxx
      // - 7x xxxx xxx
      // - 0 7x xxxx xxx
      if (!cleanPhone.match(/^(\+221|00221)?[0-9]{9}$/) && 
          !cleanPhone.match(/^0?[0-9]{9}$/) && 
          !cleanPhone.match(/^[0-9]{9}$/)) {
        newErrors.telephone = 'Format invalide. Exemples acceptés : +221 77 123 45 67, 00221 77 123 45 67, 77 123 45 67, 077 123 45 67';
      }
    }

    if (!formData.commune || formData.commune.length < 2) {
      newErrors.commune = 'La commune doit contenir au moins 2 caractères';
    }

    return newErrors;
  };

  const handleImageSelected = (file: File | null, previewUrl: string | null) => {
    console.log('Image sélectionnée:', { file, previewUrl });
    if (file && previewUrl) {
      setSelectedImage({ file, previewUrl });
    } else {
      setSelectedImage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation du formulaire
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      let imageUrl = formData.image_url;
      console.log('État initial:', { imageUrl, selectedImage });

      // Si une nouvelle image a été sélectionnée, l'uploader vers imgbb
      if (selectedImage) {
        console.log('Début de l\'upload vers imgbb...');
        try {
          imageUrl = await uploadToImgbb(selectedImage.file);
          console.log('Upload imgbb réussi, nouvelle URL:', imageUrl);
        } catch (err) {
          console.error('Erreur détaillée lors de l\'upload de l\'image:', err);
          toast.error('Erreur lors de l\'upload de l\'image');
          setIsLoading(false);
          return;
        }
      }

      // Standardiser le numéro de téléphone
      let telephone = formData.telephone?.trim() || '';
      if (telephone) {


        
        // Si le numéro commence par 7 et n'a pas le code pays, ajouter +221
        if (telephone.match(/^7[0-9]{8}$/) && !telephone.startsWith('+221')) {
          telephone = `+221${telephone}`;
        }
      }

      console.log('Données à envoyer à l\'API:', {
        ...formData,
        telephone,
        image_url: imageUrl,
      });

      // Mettre à jour le profil avec la nouvelle URL d'image
      const updatedUser = await updateProfile({
        ...formData,
        telephone,
        image_url: imageUrl,
      });

      console.log('Profil mis à jour avec succès:', updatedUser);
      updateUser(updatedUser);
      toast.success('Profil mis à jour avec succès');
      navigate('/profile');
    } catch (err) {
      console.error('Erreur détaillée lors de la mise à jour du profil:', err);
      if (err instanceof Error) {
        if (err.message.includes('existe déjà')) {
          setErrors({ telephone: 'Ce numéro de téléphone est déjà utilisé' });
        } else {
          toast.error(err.message);
        }
      } else {
        toast.error('Une erreur est survenue lors de la mise à jour du profil');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Upload vers imgbb
  const uploadToImgbb = async (file: File): Promise<string> => {
    console.log('Début uploadToImgbb avec fichier:', file.name, file.type, file.size);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });

      console.log('Réponse imgbb status:', response.status);
      const data = await response.json();
      console.log('Réponse imgbb data:', data);

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status} - ${data.error?.message || 'Erreur inconnue'}`);
      }

      if (!data.success) {
        throw new Error(data.error?.message || 'Erreur lors de l\'upload de l\'image');
      }

      return data.data.url;
    } catch (err) {
      console.error('Erreur complète uploadToImgbb:', err);
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            leftIcon={<X className="h-5 w-5" />}
            onClick={() => navigate('/profile')}
          >
            Annuler
          </Button>
        </div>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Modifier le profil</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center mb-8">
              <ImageUpload
                currentImageUrl={selectedImage?.previewUrl || formData.image_url || '/default-avatar.png'}
                onImageSelected={handleImageSelected}
              />
            </div>

            <Input
              label="Nom complet"
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="Votre nom complet"
              icon={User}
              error={errors.full_name}
              required
            />

            <Input
              label="Numéro de téléphone"
              type="tel"
              value={formData.telephone}
              onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
              placeholder="+221 77 123 45 67"
              icon={Phone}
              error={errors.telephone}
              required
            />

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Commune
              </label>
              <div className="relative">
                <MapPin
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <select
                  value={formData.commune}
                  onChange={(e) => setFormData({ ...formData, commune: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 border ${errors.commune ? 'border-red-300' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300 appearance-none bg-white`}
                  required
                >
                  <option value="">Sélectionnez votre commune</option>
                  {COMMUNES.map((commune) => (
                    <option key={commune} value={commune}>
                      {commune}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              {errors.commune && (
                <p className="text-sm text-red-600">{errors.commune}</p>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/profile')}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Enregistrement...
                  </div>
                ) : (
                  'Enregistrer les modifications'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
