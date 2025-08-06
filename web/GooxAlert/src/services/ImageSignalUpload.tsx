import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ImageUploadProps {
  currentImageUrl: string;
  onImageSelected: (imageFile: File | null) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ currentImageUrl, onImageSelected }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(currentImageUrl);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérification de la taille du fichier (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'image ne doit pas dépasser 5MB');
      return;
    }

    // Vérification du type de fichier
    if (!file.type.startsWith('image/')) {
      toast.error('Le fichier doit être une image');
      return;
    }

    setIsLoading(true);
    try {
      // Créer une URL de prévisualisation
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        onImageSelected(file);
        toast.success('Image sélectionnée');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Erreur lors de la lecture de l\'image:', error);
      toast.error('Erreur lors de la lecture de l\'image');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative group">
      <img
        src={previewUrl}
        alt='Veuillez choisir une image de moins de 5MB'
        className="w-full h-full object-cover border-4 border-white shadow-lg"
      />
      <label
        htmlFor="image-upload"
        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-200"
      >
        {isLoading ? (
          <div className="w-8 h-8 border-4 border-white border-t-transparent animate-spin" />
        ) : (
          <Camera className="w-8 h-8 text-white" />
        )}
      </label>
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={isLoading}
      />
    </div>
  );
};

export default ImageUpload;

// Fonction utilitaire pour uploader l'image vers imgBB
export const uploadImageToImgBB = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=49a117f96f4b6126c8c616a07f23eb06`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  if (data.success) {
    return data.data.url;
  } else {
    throw new Error('Erreur lors de l\'upload de l\'image.');
  }
}; 