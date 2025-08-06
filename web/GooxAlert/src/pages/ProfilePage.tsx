import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, Edit } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;



  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="relative h-48 bg-gradient-to-r from-primary-600 to-primary-400">
            <div className="absolute -bottom-16 left-8">
              <img 
                className="w-32 h-32 rounded-full border-4 border-white shadow-xl"
                src={user.image_url || 'https://i.ibb.co/DHYkxSYT/OIP-1.jpg'}
                alt="Photo de profil"
              />
            </div>
          </div>

          {/* Profile content */}
          <div className="pt-20 pb-8 px-8">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Informations personnelles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-4">
                  <User className="w-6 h-6 text-primary-500 mt-1" />
                  <div>
                    <span className="text-sm font-medium text-gray-500">Nom complet</span>
                    <p className="mt-1 text-lg text-gray-900">{user.full_name}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-primary-500 mt-1" />
                  <div>
                    <span className="text-sm font-medium text-gray-500">Téléphone</span>
                    <p className="mt-1 text-lg text-gray-900">{user.telephone}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-primary-500 mt-1" />
                  <div>
                    <span className="text-sm font-medium text-gray-500">Commune</span>
                    <p className="mt-1 text-lg text-gray-900">{user.commune || 'Non renseignée'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Logout button */}
            <div className="flex mt-6 gap-2">
              <button
                    onClick={() => navigate('/profile/edit')}
                    className="px-6 py-2.5 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors duration-200 flex items-center"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Modifier le profil
                  </button>
              <button
                onClick={() => navigate('/profile/edit-password')}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center"
              >
                <Edit className="w-4 h-4 mr-2" />
                Modifier Mot de passe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
