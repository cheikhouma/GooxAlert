import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Phone, MapPin, User, ArrowRight } from 'lucide-react';
import { Input } from '../components/common/Input';
import { validatePhone, validateName, validateCommune } from '../utils/validation';

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

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [telephone, setTelephone] = useState('');
  const [commune, setCommune] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Veuillez entrer votre nom complet';
    } else if (!validateName(name)) {
      newErrors.name = 'Veuillez separer votre nom et prenom par un espace';
    }
    
    if (!telephone.trim()) {
      newErrors.telephone = 'Veuillez entrer votre numéro de téléphone';
    } else if (!validatePhone(telephone)) {
      newErrors.telephone = 'Veuillez entrer un numéro valide, exemple : +221 77 123 45 67 ou 771234567';
    }

    if (!commune) {
      newErrors.commune = 'Veuillez sélectionner votre commune';
    } else if (!validateCommune(commune)) {
      newErrors.commune = 'Veuillez sélectionner une commune valide';
    }

    if (!password) {
      newErrors.password = 'Veuillez entrer un mot de passe';
    } else if (password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Veuillez confirmer votre mot de passe';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    const termsCheckbox = document.getElementById('terms') as HTMLInputElement;
    if (!termsCheckbox?.checked) {
      newErrors.terms = 'Veuillez accepter les conditions d\'utilisation';
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

      await register(name, standardizedPhone, password, commune);
      navigate('/login', {
        state: {
          message: 'Inscription réussie ! Vous pouvez maintenant vous connecter.',
          telephone: standardizedPhone
        }
      });
    } catch (err: any) {
      console.error('Registration failed:', err);
      let errorMessage = 'L\'inscription a échoué. Veuillez réessayer.';

      if (err.message) {
        errorMessage = err.message;
      }

      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleInvalid = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    validateForm();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    switch (name) {
      case 'name':
        setName(value);
        break;
      case 'telephone':
        setTelephone(value);
        break;
      case 'commune':
        setCommune(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
      case 'terms':
        const checked = (e.target as HTMLInputElement).checked;
        if (checked && errors.terms) {
          setErrors(prev => ({ ...prev, terms: '' }));
        }
        break;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <MapPin className="h-12 w-12 text-primary-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Créer un compte</h2>
          <p className="mt-2 text-gray-600">
            Ou{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              connectez-vous à votre compte existant
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} onInvalid={handleInvalid} noValidate>
          <div className="space-y-4">
            <Input
              label="Nom complet"
              name="name"
              type="text"
              value={name}
              onChange={handleInputChange}
              placeholder="Votre nom complet"
              icon={User}
              error={errors.name}
              required
            />

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
                  name="commune"
                  value={commune}
                  onChange={handleInputChange}
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

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              onChange={handleInputChange}
              className={`h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded ${errors.terms ? 'border-red-300' : ''
                }`}
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
              J'accepte les{' '}
              <Link to="/terms" className="font-medium text-primary-600 hover:underline">
                conditions d'utilisation
              </Link>
              {' '}et la{' '}
              <Link to="/privacy" className="font-medium text-primary-600 hover:underline">
                politique de confidentialité
              </Link>
            </label>
          </div>
          {errors.terms && (
            <p className="text-sm text-red-600">{errors.terms}</p>
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
                  Création du compte...
                </div>
              ) : (
                <>
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <ArrowRight className="h-5 w-5 text-primary-500 group-hover:text-primary-400" />
                  </span>
                  Créer un compte
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            En vous inscrivant, vous acceptez de recevoir des notifications concernant vos signalements et les problèmes dans votre quartier.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;