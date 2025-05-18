import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, isAuthenticated, isInitialized } = useAuth();
  const location = useLocation();

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <LogIn className="mx-auto mb-4 w-12 h-12 text-gray-400" />
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Connexion requise</h2>
        <p className="text-gray-600 mb-4">
          Vous devez être connecté pour signaler un problème ou voir vos signalements sur la carte.
        </p>
        <Link 
          to="/login" 
          className="inline-block px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
        >
          Se connecter
        </Link>
      </div>
    );
  }

  if (requiredRole && user?.role !== requiredRole && !(requiredRole === 'user' && user?.role === 'admin')) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;