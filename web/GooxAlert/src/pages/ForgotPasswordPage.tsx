import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, ArrowLeft } from 'lucide-react';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { checkPhone } from '../services/authService';
import { validatePhone } from '../utils/validation';

const ForgotPasswordPage = () => {
  const [telephone, setTelephone] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!telephone.trim()) {
      newErrors.telephone = 'Veuillez entrer votre numéro de téléphone';
    } else if (!validatePhone(telephone)) {
      newErrors.telephone = 'Veuillez entrer un numéro valide, exemple : +221 77 123 45 67 ou 771234567';
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

      const result = await checkPhone(standardizedPhone);
      
      if (result.status === "success") {
        navigate('/otp-verification', { 
          state: { 
            telephone: standardizedPhone,
            isPasswordReset: true 
          } 
        });
      } else {
        if (result.message) {
          if (result.message.includes('existe pas')) {
            setErrors({ telephone: 'Aucun compte associé à ce numéro de téléphone' });
          } else {
            setErrors({ submit: result.message });
          }
        } else {
          setErrors({ submit: 'Une erreur est survenue. Veuillez réessayer.' });
        }
      }
    } catch (err) {
      console.error('Password reset request failed:', err);
      if (err instanceof Error) {
        if (err.message.includes('Network Error')) {
          setErrors({ submit: 'Erreur de connexion. Veuillez vérifier votre connexion internet.' });
        } else {
          setErrors({ submit: err.message });
        }
      } else {
        setErrors({ submit: 'Une erreur inattendue est survenue. Veuillez réessayer.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            leftIcon={<ArrowLeft className="h-5 w-5" />}
            onClick={() => navigate('/login')}
          >
            Retour à la connexion
          </Button>
        </div>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <Phone className="mx-auto h-12 w-12 text-primary-600" />
            <h2 className="mt-6 text-2xl font-bold text-gray-900">Mot de passe oublié</h2>
            <p className="mt-2 text-gray-600">
              Entrez votre numéro de téléphone pour recevoir un code de réinitialisation
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <Input
              label="Numéro de téléphone"
              type="tel"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              placeholder="+221 77 123 45 67"
              icon={Phone}
              error={errors.telephone}
              required
            />

            {errors.submit && (
              <p className="text-sm text-red-600">{errors.submit}</p>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={loading}
            >
              Envoyer le code
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage; 