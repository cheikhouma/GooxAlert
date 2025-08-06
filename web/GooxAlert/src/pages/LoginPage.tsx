import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MapPin, Lock, Phone } from 'lucide-react';
import { Input } from '../components/common/Input';
import { validatePhone } from '../utils/validation';

const LoginPage = () => {
  const [telephone, setTelephone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!telephone.trim()) {
      newErrors.telephone = 'Veuillez entrer votre numéro de téléphone';
    } else if (!validatePhone(telephone)) {
      newErrors.telephone = 'Veuillez entrer un numéro valide, exemple : +221 77 123 45 67 ou 771234567';
    }

    if (!password) {
      newErrors.password = 'Veuillez entrer votre mot de passe';
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
      // Standardiser le numéro de téléphone
      const cleanPhone = telephone.replace(/\s+/g, '');
      let standardizedPhone = cleanPhone;

      // Si numéro local commençant par 7x et 9 chiffres sans +221
      if (/^0?(75|76|77|78|70)[0-9]{7}$/.test(cleanPhone)) {
        standardizedPhone = `+221${cleanPhone.replace(/^0/, '')}`;
      }

      await login(standardizedPhone, password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login failed:', err);
      setErrors({ submit: 'Identifiants invalides. Veuillez réessayer.' });
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
      case 'telephone':
        setTelephone(value);
        break;
      case 'password':
        setPassword(value);
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
        {message && (
          <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Succès !</strong>
            <span className="block sm:inline"> {message}</span>
          </div>
        )}
        <div className="text-center">
          <div className="flex justify-center">
            <MapPin className="h-12 w-12 text-primary-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Connexion</h2>
          <p className="mt-2 text-gray-600">
            Ou{' '}
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
              créez un nouveau compte
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} onInvalid={handleInvalid} noValidate>
          <div className="space-y-4">
            <Input
              label="Numéro de téléphone"
              name="telephone"
              type="tel"
              value={telephone}
              onChange={handleInputChange}
              placeholder="+221 77 123 45 67"
              icon={Phone}
              error={errors.telephone}
              required
            />

            <Input
              label="Mot de passe"
              name="password"
              type="password"
              value={password}
              onChange={handleInputChange}
              placeholder="••••••••"
              icon={Lock}
              error={errors.password}
              required
            />
          </div>

          {errors.submit && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
              {errors.submit}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember_me"
                name="remember_me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
                Se souvenir de moi
              </label>
            </div>

            <div className="text-sm">
              <Link to="/mot-de-passe-oublie" className="font-medium text-primary-600 hover:text-primary-500">
                Mot de passe oublié ?
              </Link>
            </div>
          </div>

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
                  Connexion...
                </div>
              ) : (
                'Se connecter'
              )}
            </button>
          </div>
        </form>
      </div>
        
    </div>
  );
};

export default LoginPage;