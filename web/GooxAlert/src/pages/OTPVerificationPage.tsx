import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Phone, ArrowLeft } from 'lucide-react';
import { Input } from '../components/common/Input';

const OTPVerificationPage = () => {
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { telephone, isPasswordReset } = location.state || {};

  useEffect(() => {
    if (!telephone) {
      navigate('/login');
    }
  }, [telephone, navigate]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!otp) {
      newErrors.otp = 'Veuillez entrer le code de vérification';
    } else if (!/^\d{6}$/.test(otp)) {
      newErrors.otp = 'Le code doit contenir 6 chiffres';
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
      // TODO: Implémenter la vérification OTP avec l'API
      // Simuler un délai de réponse
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (isPasswordReset) {
        // Rediriger vers la page de réinitialisation du mot de passe
        navigate('/reset-password', { 
          state: { 
            telephone,
            otp
          } 
        });
      } else {
        // Rediriger vers la page de connexion avec un message de succès
        navigate('/login', { 
          state: { 
            message: 'Votre compte a été vérifié avec succès. Veuillez vous connecter.' 
          } 
        });
      }
    } catch (err) {
      console.error('OTP verification failed:', err);
      setErrors({ submit: 'Une erreur est survenue. Veuillez réessayer.' });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;

    setLoading(true);
    setErrors({});

    try {
      // TODO: Implémenter le renvoi du code avec l'API
      // Simuler un délai de réponse
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCountdown(60); // 60 secondes avant de pouvoir renvoyer le code
    } catch (err) {
      console.error('Failed to resend code:', err);
      setErrors({ submit: 'Une erreur est survenue lors du renvoi du code.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    
    if (errors.otp) {
      setErrors(prev => ({ ...prev, otp: '' }));
    }

    // N'autoriser que les chiffres
    if (/^\d*$/.test(value)) {
      setOtp(value);
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
            <Phone className="h-12 w-12 text-primary-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Vérification du numéro</h2>
          <p className="mt-2 text-gray-600">
            Entrez le code de vérification envoyé au {telephone}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} onInvalid={handleInvalid} noValidate>
          <div>
            <Input
              label="Code de vérification"
              name="otp"
              type="text"
              value={otp}
              onChange={handleInputChange}
              placeholder="123456"
              maxLength={6}
              error={errors.otp}
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
                  Vérification...
                </div>
              ) : (
                'Vérifier'
              )}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </button>

            <button
              type="button"
              onClick={handleResendCode}
              disabled={countdown > 0 || loading}
              className="text-sm font-medium text-primary-600 hover:text-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {countdown > 0
                ? `Renvoyer le code (${countdown}s)`
                : 'Renvoyer le code'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OTPVerificationPage; 