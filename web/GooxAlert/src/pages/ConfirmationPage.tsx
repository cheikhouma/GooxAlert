import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle } from 'lucide-react';

const ConfirmationPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-primary-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Signalement enregistré
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Votre signalement a été bien reçu et est en cours de traitement.
          </p>
          <div className="mt-4 space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="flex-shrink-0 h-5 w-5 text-blue-400 mr-3" />
                <p className="text-sm text-blue-700">
                  Vous recevrez une notification dès que le problème sera en cours de résolution.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
