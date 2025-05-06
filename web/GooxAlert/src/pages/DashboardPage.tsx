import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import IssueList from '../components/issues/IssueList';
import { User, MapPin, Edit, LogOut, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import {useIssues} from "../contexts/IssueContext.tsx";

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const { userIssues, issues } = useIssues();
  const [activeTab, setActiveTab] = useState<'issues' | 'profile'>('issues');

  if (!user) {
    return null;
  }

  const supportedIssues = issues.filter(issue => 
    user && issue.upvotedBy.includes(user.id)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600">Gérez vos signalements et votre profil</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link 
            to="/report" 
            className="inline-flex items-center bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-md font-medium transition-colors"
          >
            <MapPin className="w-5 h-5 mr-2" />
            Nouveau signalement
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center">
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=10B981&color=fff`}
                alt={user.name}
                className="h-16 w-16 rounded-full"
              />
              <div className="ml-4">
                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
            
            <div className="mt-6 space-y-2">
              <button
                onClick={() => setActiveTab('issues')}
                className={`flex items-center w-full px-4 py-2 rounded-md text-left ${
                  activeTab === 'issues'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <MapPin className="w-5 h-5 mr-3" />
                Mes signalements
              </button>
              
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center w-full px-4 py-2 rounded-md text-left ${
                  activeTab === 'profile'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <User className="w-5 h-5 mr-3" />
                Mon profil
              </button>
              
              <button
                onClick={logout}
                className="flex items-center w-full px-4 py-2 rounded-md text-left text-gray-700 hover:bg-gray-50"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Déconnexion
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Statistiques</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Signalements créés</span>
                  <span className="font-medium">{userIssues.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full" 
                    style={{ width: `${Math.min(100, (userIssues.length / 10) * 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Signalements soutenus</span>
                  <span className="font-medium">{supportedIssues.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-secondary-600 h-2 rounded-full" 
                    style={{ width: `${Math.min(100, (supportedIssues.length / 20) * 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Problèmes résolus</span>
                  <span className="font-medium">
                    {userIssues.filter(issue => issue.status === 'resolved').length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-success-600 h-2 rounded-full" 
                    style={{ 
                      width: `${Math.min(100, (userIssues.filter(issue => issue.status === 'resolved').length / Math.max(1, userIssues.length)) * 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-3">
          {activeTab === 'issues' ? (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">Mes signalements</h2>
                <p className="text-gray-600">
                  Consultez et gérez tous vos signalements
                </p>
              </div>
              
              <IssueList 
                issues={userIssues} 
                title="" 
                emptyMessage="Vous n'avez pas encore créé de signalement."
                showFilters={false}
              />
              
              {userIssues.length === 0 && (
                <div className="mt-4 text-center">
                  <Link 
                    to="/report" 
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Créer votre premier signalement
                  </Link>
                </div>
              )}
              
              {supportedIssues.length > 0 && (
                <div className="mt-12">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Signalements soutenus</h2>
                  <IssueList 
                    issues={supportedIssues} 
                    title="" 
                    showFilters={false}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Mon profil</h2>
                <p className="text-gray-600">
                  Gérez vos informations personnelles et vos préférences
                </p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="input"
                    defaultValue={user.name}
                    placeholder="Votre nom"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="input"
                    defaultValue={user.email}
                    placeholder="votre.email@example.com"
                  />
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Préférences de notification</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        id="notify-updates"
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        defaultChecked
                      />
                      <label htmlFor="notify-updates" className="ml-2 block text-sm text-gray-700">
                        Recevoir des mises à jour sur mes signalements
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="notify-comments"
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        defaultChecked
                      />
                      <label htmlFor="notify-comments" className="ml-2 block text-sm text-gray-700">
                        Recevoir des notifications pour les nouveaux commentaires
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="notify-area"
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        defaultChecked
                      />
                      <label htmlFor="notify-area" className="ml-2 block text-sm text-gray-700">
                        Recevoir des alertes sur les nouveaux problèmes à proximité
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4 pt-4">
                  <button type="button" className="btn btn-outline">
                    Annuler
                  </button>
                  <button type="button" className="btn btn-primary">
                    Enregistrer les modifications
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;