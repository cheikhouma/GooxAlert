import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin';
  showLoginPrompt?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  showLoginPrompt = true 
}) => {
  const { user, isAuthenticated, isAdmin, isInitialized } = useAuth();
  const location = useLocation();

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (!showLoginPrompt) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <LogIn className="mx-auto mb-4 w-12 h-12 text-gray-400" />
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Connexion requise</h2>
        <p className="text-gray-600 mb-4">
          Vous devez être connecté pour accéder à cette page.
        </p>
        <Link 
          to="/login" 
          state={{ from: location }}
          className="inline-block px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
        >
          Se connecter
        </Link>
      </div>
    );
  }

  if (requiredRole === 'admin' && !isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <Shield className="mx-auto mb-4 w-12 h-12 text-gray-400" />
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Accès non autorisé</h2>
        <p className="text-gray-600 mb-4">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>
        <Link 
          to="/"
          className="inline-block px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
        >
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;