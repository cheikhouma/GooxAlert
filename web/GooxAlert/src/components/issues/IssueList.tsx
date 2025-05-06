import React, { useState } from 'react';
import { Issue, IssueCategory, IssueStatus } from '../../types';
import IssueCard from './IssueCard';
import { Search, Filter, AlertTriangle } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';


interface IssueListProps {
  issues: Issue[];
  title?: string;
  emptyMessage?: string;
  showFilters?: boolean;
  onlyUserIssues?: boolean; // 👈 nouveau prop pour optionnellement filtrer par user
}

const IssueList: React.FC<IssueListProps> = ({ 
  issues, 
  title = 'Signalements', 
  emptyMessage = 'Aucun signalement trouvé',
  showFilters = true,
  onlyUserIssues = false
}) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<IssueCategory | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<IssueStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');

  if (onlyUserIssues && !user) {
    return <Navigate to="/" replace />;
  }

  const filteredIssues = issues
    .filter(issue => {
      const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            issue.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || issue.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || issue.status === selectedStatus;
      const matchesUser = !onlyUserIssues || (user && issue.userId === user.id); // 👈 filtrage par user

      return matchesSearch && matchesCategory && matchesStatus && matchesUser;
    });

  const sortedIssues = [...filteredIssues].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0; // Default case when sortBy is not 'recent'
  });

  const categories: Array<{value: IssueCategory | 'all', label: string}> = [
    { value: 'all', label: 'Toutes les catégories' },
    { value: 'lighting', label: 'Éclairage' },
    { value: 'waste', label: 'Déchets' },
    { value: 'road', label: 'Voirie' },
    { value: 'water', label: 'Eau' },
    { value: 'electricity', label: 'Électricité' },
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'other', label: 'Autre' }
  ];

  const statuses: Array<{value: IssueStatus | 'all', label: string}> = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'pending', label: 'En attente' },
    { value: 'in_progress', label: 'En cours' },
    { value: 'resolved', label: 'Résolu' },
    { value: 'rejected', label: 'Rejeté' }
  ];

  return (
    <div>
      <h2 className="text-2xl font-medium mb-6">{title}</h2>
      
      {showFilters && (
        <div className="mb-6">
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un signalement..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-700">Filtres:</span>
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as IssueCategory | 'all')}
              className="text-sm rounded-md border-gray-300 py-1 pl-3 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>{category.label}</option>
              ))}
            </select>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as IssueStatus | 'all')}
              className="text-sm rounded-md border-gray-300 py-1 pl-3 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'recent' | 'popular')}
              className="text-sm rounded-md border-gray-300 py-1 pl-3 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="recent">Plus récents</option>
              <option value="popular">Plus populaires</option>
            </select>
          </div>
          
          {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all' ? (
            <div className="mb-4 text-sm">
              <span className="font-medium">{filteredIssues.length}</span> résultat{filteredIssues.length !== 1 ? 's' : ''} trouvé{filteredIssues.length !== 1 ? 's' : ''}
              {' '}<button onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedStatus('all');
              }} className="text-primary-600 hover:underline">Réinitialiser les filtres</button>
            </div>
          ) : null}
        </div>
      )}
      
      {sortedIssues.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{emptyMessage}</h3>
          <p className="text-gray-500">Essayez de modifier vos filtres ou de rechercher autre chose.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      )}
    </div>
  );
};

export default IssueList;