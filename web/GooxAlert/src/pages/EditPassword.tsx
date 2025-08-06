import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';
import { updatePassword } from '../services/profileService';
import { validatePasswordStrength, getPasswordStrengthColor } from '../utils/validation';

const EditPassword = () => {
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    return () => {
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrors({});
    };
  }, [user, navigate]);

  useEffect(() => {
    if (newPassword) {
      setPasswordStrength(validatePasswordStrength(newPassword));
    }
  }, [newPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    if (!password) {
      setErrors(prev => ({ ...prev, password: 'Veuillez entrer votre mot de passe actuel' }));
      return;
    }

    if (!newPassword) {
      setErrors(prev => ({ ...prev, newPassword: 'Veuillez entrer un nouveau mot de passe' }));
      return;
    }

    if (passwordStrength < 3) {
      setErrors(prev => ({ ...prev, newPassword: 'Le mot de passe est trop faible' }));
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Les mots de passe ne correspondent pas' }));
      return;
    }

    try {
      setLoading(true);
      await updatePassword(password, newPassword);
      logout();
      navigate('/login', { 
        state: { message: 'Mot de passe modifié avec succès. Veuillez vous reconnecter.' }
      });
    } catch (error: any) {
      if (error.response?.status === 401) {
        setErrors(prev => ({ ...prev, password: 'Mot de passe actuel incorrect' }));
      } else {
        setErrors(prev => ({ ...prev, general: 'Une erreur est survenue lors de la modification du mot de passe' }));
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
            onClick={() => navigate('/profile')}
          >
            Retour au profil
          </Button>
        </div>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Modifier le mot de passe</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Mot de passe actuel"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              icon={Lock}
            />

            <Input
              label="Nouveau mot de passe"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              error={errors.newPassword}
              icon={Lock}
            />

            {newPassword && (
              <div className="space-y-2">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)}`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Force du mot de passe: {passwordStrength}/5
                </p>
              </div>
            )}

            <Input
              label="Confirmer le nouveau mot de passe"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              icon={Lock}
            />

            {errors.general && (
              <p className="text-sm text-red-600">{errors.general}</p>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={loading}
            >
              Modifier le mot de passe
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPassword; 