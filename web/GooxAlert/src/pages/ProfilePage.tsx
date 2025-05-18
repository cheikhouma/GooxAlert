import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Camera, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    telephone: user?.telephone || '',
  });

  if (!user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mise à jour du profil dans le localStorage
    const updatedUser = {
      ...user,
      name: formData.name,
      telephone: formData.telephone,
      avatar: `https://ui-avatars.com/api/?name=${formData.name}&background=10B981&color=fff`
    };
    
    localStorage.setItem('smartDakarUser', JSON.stringify(updatedUser));
    window.location.reload(); // Recharger la page pour mettre à jour le contexte
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm">
        {/* En-tête du profil */}
        <div className="relative h-32 bg-primary-500 rounded-t-lg">
          <div className="absolute -bottom-16 left-8">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
              />
              {isEditing && (
                <button
                  className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                  onClick={() => {/* TODO: Implémenter le changement d'avatar */}}
                >
                  <Camera className="w-5 h-5 text-gray-600" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Informations du profil */}
        <div className="pt-20 pb-8 px-8">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nom
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">
                  Numéro de téléphone
                </label>
                <input
                  type="tel"
                  id="telephone"
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <X className="w-4 h-4 inline-block mr-2" />
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-md hover:bg-primary-600"
                >
                  <Save className="w-4 h-4 inline-block mr-2" />
                  Enregistrer
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-500">{user.telephone}</p>
                <p className="mt-2 text-sm text-gray-600">
                  Rôle : <span className="font-medium capitalize">{user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}</span>
                </p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-md hover:bg-primary-600"
                >
                  Modifier le profil
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Se déconnecter
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 