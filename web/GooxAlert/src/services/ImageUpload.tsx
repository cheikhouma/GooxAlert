import React, { useState, useCallback } from 'react';
import { Camera,  Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Types
interface ImageUploadProps {
  currentImageUrl: string;
  onImageSelected: (file: File | null, previewUrl: string | null) => void;
  maxSizeMB?: number;
  allowedTypes?: string[];
}

interface UploadError {
  code: 'SIZE_ERROR' | 'TYPE_ERROR' | 'UPLOAD_ERROR' | 'NETWORK_ERROR';
  message: string;
}

// Constants
const DEFAULT_MAX_SIZE_MB = 5;
const DEFAULT_ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImageUrl,
  onImageSelected,
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
  allowedTypes = DEFAULT_ALLOWED_TYPES,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<UploadError | null>(null);

  // Validation du fichier
  const validateFile = useCallback((file: File): UploadError | null => {
    console.log('Validation du fichier:', {
      size: file.size,
      type: file.type,
      maxSize: maxSizeMB * 1024 * 1024,
      allowedTypes
    });

    if (file.size > maxSizeMB * 1024 * 1024) {
      return {
        code: 'SIZE_ERROR',
        message: `L'image ne doit pas dépasser ${maxSizeMB}MB`,
      };
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        code: 'TYPE_ERROR',
        message: 'Format d\'image non supporté. Formats acceptés : JPG, PNG, GIF, WEBP',
      };
    }

    return null;
  }, [maxSizeMB, allowedTypes]);

  // Création de l'URL de prévisualisation
  const createPreviewUrl = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  // Gestion du changement de fichier
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log('Fichier sélectionné:', file);
    if (!file) return;

    // Réinitialiser les états
    setError(null);
    setPreviewUrl(null);
    setSelectedFile(null);

    // Validation
    const validationError = validateFile(file);
    if (validationError) {
      console.log('Erreur de validation:', validationError);
      setError(validationError);
      toast.error(validationError.message);
      return;
    }

    try {
      // Créer la prévisualisation
      console.log('Création de la prévisualisation...');
      const preview = await createPreviewUrl(file);
      console.log('Prévisualisation créée:', preview.substring(0, 50) + '...');
      setPreviewUrl(preview);
      setSelectedFile(file);
      // Notifier le composant parent
      console.log('Notification au parent avec:', { file, preview });
      onImageSelected(file, preview);
    } catch (err) {
      console.error('Erreur lors de la prévisualisation:', err);
      setError({ code: 'UPLOAD_ERROR', message: 'Erreur lors de la prévisualisation de l\'image' });
      toast.error('Erreur lors de la prévisualisation de l\'image');
    } finally {
      // Réinitialiser l'input pour permettre la sélection du même fichier
      e.target.value = '';
    }
  }, [validateFile, createPreviewUrl, onImageSelected]);

  // Annuler la prévisualisation
  const handleCancelPreview = useCallback(() => {
    console.log('Annulation de la prévisualisation');
    setPreviewUrl(null);
    setSelectedFile(null);
    setError(null);
    // Notifier le composant parent
    onImageSelected(null, null);
  }, [onImageSelected]);

  return (
    <div className="relative group">
      <div className="relative">
        <img
          src={previewUrl || currentImageUrl}
          className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg transition-opacity duration-200"
          alt="Photo de profil"
        />
        {previewUrl && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black bg-opacity-50 rounded-full">
            
          </div>
        )}
      </div>
      {!previewUrl && (
        <label
          htmlFor="image-upload"
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-200"
        >
          <Camera className="w-8 h-8 text-white" />
        </label>
      )}
      <input
        id="image-upload"
        type="file"
        accept={allowedTypes.join(',')}
        onChange={handleFileChange}
        className="hidden"
      />
      {error && (
        <p className="mt-2 text-sm text-red-600 text-center">{error.message}</p>
      )}
    </div>
  );
};

export default ImageUpload; 