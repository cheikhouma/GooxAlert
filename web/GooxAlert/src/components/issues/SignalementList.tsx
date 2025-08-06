import React, { useState } from 'react';
import { Signalement, IssueCategory, IssueStatus } from '../../types';
import SignalementCard from './SignalementCard';
import { Search, Filter, AlertTriangle } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface SignalementListProps {
  signalements: Signalement[];
  title?: string;
  emptyMessage?: string;
  showFilters?: boolean;
  onlyUserSignalements?: boolean;
}

const SignalementList: React.FC<SignalementListProps> = ({
  signalements,
  title = 'Signalements',
  emptyMessage = 'Aucun signalement trouvé',
  showFilters = false,
}) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<IssueStatus | ''>('');
  const [categoryFilter, setCategoryFilter] = useState<IssueCategory | ''>('');

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const filteredSignalements = signalements.filter(signalement => {
    const matchesSearch = 
      signalement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      signalement.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !statusFilter || signalement.status === statusFilter;
    const matchesCategory = !categoryFilter || signalement.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {title && (
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      )}

      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un signalement..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as IssueStatus | '')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Tous les statuts</option>
            <option value="en_attente">En attente</option>
            <option value="en_cours">En cours</option>
            <option value="resolu">Résolu</option>
            <option value="rejected">Rejeté</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as IssueCategory | '')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Toutes les catégories</option>
            <option value="voirie">Voirie</option>
            <option value="infrastructure">Infrastructure</option>
            <option value="eclairage">Éclairage</option>
            <option value="ordures">Ordures</option>
            <option value="eau">Eau</option>
            <option value="nuisances">Nuisances</option>
            <option value="espaces_verts">Espaces verts</option>
            <option value="securite">Sécurité</option>
            <option value="signalisation">Signalisation</option>
            <option value="autre">Autre</option>
          </select>
        </div>
      )}

      {filteredSignalements.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun signalement</h3>
          <p className="mt-1 text-sm text-gray-500">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSignalements.map((signalement) => (
            <SignalementCard
              key={signalement.id}
              signalement={signalement}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SignalementList;