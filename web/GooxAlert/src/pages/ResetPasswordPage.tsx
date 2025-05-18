import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';
import { Input } from '../components/common/Input';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { telephone, otp } = location.state || {};

  useEffect(() => {
    if (!telephone || !otp) {
      navigate('/login');
    }
  }, [telephone, otp, navigate]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!password) {
      newErrors.password = 'Veuillez entrer un nouveau mot de passe';
    } else if (password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Veuillez confirmer votre mot de passe';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // TODO: Implémenter la réinitialisation du mot de passe avec l'API
      // Simuler un délai de réponse
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Rediriger vers la page de connexion avec un message de succès
      navigate('/login', { 
        state: { 
          message: 'Votre mot de passe a été réinitialisé avec succès. Veuillez vous connecter.' 
        } 
      });
    } catch (err) {
      console.error('Password reset failed:', err);
      setErrors({ submit: 'Une erreur est survenue. Veuillez réessayer.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    switch (name) {
      case 'password':
        setPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
    }
  };

  const handleInvalid = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    validateForm();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Lock className="h-12 w-12 text-primary-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Réinitialiser le mot de passe</h2>
          <p className="mt-2 text-gray-600">
            Choisissez un nouveau mot de passe pour votre compte
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} onInvalid={handleInvalid} noValidate>
          <div className="space-y-4">
            <Input
              label="Nouveau mot de passe"
              name="password"
              type="password"
              value={password}
              onChange={handleInputChange}
              placeholder="••••••••"
              icon={Lock}
              error={errors.password}
              required
            />

            <Input
              label="Confirmer le mot de passe"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={handleInputChange}
              placeholder="••••••••"
              icon={Lock}
              error={errors.confirmPassword}
              required
            />
          </div>

          {errors.submit && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
              {errors.submit}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-md font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Réinitialisation...
                </div>
              ) : (
                'Réinitialiser le mot de passe'
              )}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage; 