import { Camera } from 'lucide-react';
import IssueForm from '../components/issues/IssueForm';

const ReportIssuePage = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Signaler un problème</h1>
        <p className="text-gray-600">
          Votre signalement sera traité par les services compétents. Plus vous donnez de détails, plus il sera facile de résoudre le problème.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <IssueForm />
      </div>
      
      <div className="mt-8 bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
          <Camera className="w-5 h-5 mr-2 text-primary-600" />
          Conseils pour un bon signalement
        </h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Prenez une photo claire montrant bien le problème</li>
          <li>Soyez précis dans votre description</li>
          <li>Mentionnez depuis quand le problème existe, si vous le savez</li>
          <li>Indiquez s'il présente un danger pour les personnes</li>
          <li>Vérifiez que le problème n'a pas déjà été signalé en consultant la carte</li>
        </ul>
      </div>
    </div>
  );
};

export default ReportIssuePage;