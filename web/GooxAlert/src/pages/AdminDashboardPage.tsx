import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  MapPin,
  Users,
  Settings,
  BarChart,
  LogOut
} from 'lucide-react';
import IssueMap from '../components/map/IssueMap';
import StatusBadge from '../components/issues/StatusBadge';
import {useIssues} from "../contexts/IssueContext.tsx";

const AdminDashboardPage = () => {
  const { issues, updateIssueStatus } = useIssues();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('issues');

  const pendingIssues = issues.filter(issue => issue.status === 'pending');
  const inProgressIssues = issues.filter(issue => issue.status === 'in_progress');
  const resolvedIssues = issues.filter(issue => issue.status === 'resolved');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleStatusChange = async (issueId: string, status: 'pending' | 'in_progress' | 'resolved' | 'rejected') => {
    await updateIssueStatus(issueId, status);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 h-screen fixed">
          <div className="flex items-center justify-center h-16 bg-gray-900">
            <MapPin className="h-8 w-8 text-primary-500" />
            <span className="ml-2 text-white font-bold">Admin GooxAlert</span>
          </div>
          
          <nav className="mt-6">
            <div className="px-4 mb-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Gestion
              </p>
            </div>
            
            <Link
              to="/admin"
              className={`flex items-center px-4 py-3 ${activeTab === 'issues' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
              onClick={() => setActiveTab('issues')}
            >
              <LayoutDashboard className="h-5 w-5 mr-3" />
              Tableau de bord
            </Link>
            
            <Link
              to="/admin/map"
              className={`flex items-center px-4 py-3 ${activeTab === 'map' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
              onClick={() => setActiveTab('map')}
            >
              <MapPin className="h-5 w-5 mr-3" />
              Carte des signalements
            </Link>
            
            <Link
              to="/admin/users"
              className={`flex items-center px-4 py-3 ${activeTab === 'users' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
              onClick={() => setActiveTab('users')}
            >
              <Users className="h-5 w-5 mr-3" />
              Utilisateurs
            </Link>
            
            <Link
              to="/admin/stats"
              className={`flex items-center px-4 py-3 ${activeTab === 'stats' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
              onClick={() => setActiveTab('stats')}
            >
              <BarChart className="h-5 w-5 mr-3" />
              Statistiques
            </Link>
            
            <div className="px-4 mb-3 mt-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Paramètres
              </p>
            </div>
            
            <Link
              to="/admin/settings"
              className={`flex items-center px-4 py-3 ${activeTab === 'settings' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings className="h-5 w-5 mr-3" />
              Configuration
            </Link>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Déconnexion
            </button>
          </nav>
        </div>

        {/* Main content */}
        <div className="ml-64 flex-1">
          <div className="py-6 px-8">
            <Routes>
              <Route path="/" element={
                <AdminDashboardContent
                  issues={issues}
                  pendingCount={pendingIssues.length}
                  inProgressCount={inProgressIssues.length}
                  resolvedCount={resolvedIssues.length}
                  rejectedCount={resolvedIssues.length}
                  handleStatusChange={handleStatusChange}
                />
              } />
              <Route path="/map" element={
                <div>
                  <h1 className="text-2xl font-bold mb-6">Carte des signalements</h1>
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <IssueMap issues={issues} height="700px" />
                  </div>
                </div>
              } />
              <Route path="/users" element={
                <div>
                  <h1 className="text-2xl font-bold mb-6">Gestion des utilisateurs</h1>
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <p className="text-gray-500">Fonctionnalité en cours de développement.</p>
                  </div>
                </div>
              } />
              <Route path="/issues" element={
                <div>
                  <h1 className="text-2xl font-bold mb-6">Gestion des utilisateurs</h1>
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <p className="text-gray-500">Fonctionnalité en cours de développement.</p>
                  </div>
                </div>
              } />
              <Route path="/stats" element={
                <div>
                  <h1 className="text-2xl font-bold mb-6">Statistiques</h1>
                  <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-medium mb-4">Répartition par catégorie</h2>
            <div className="space-y-4">
              {['lighting', 'waste', 'road', 'water', 'electricity', 'infrastructure', 'other'].map((category) => {
                const count = issues.filter(issue => issue.category === category).length;
                const percentage = Math.round((count / issues.length) * 100) || 0;
                
                return (
                  <div key={category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 capitalize">{category.replace('_', ' ')}</span>
                      <span className="font-medium">{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          category === 'lighting' ? 'bg-yellow-500' :
                          category === 'waste' ? 'bg-green-500' :
                          category === 'road' ? 'bg-gray-500' :
                          category === 'water' ? 'bg-blue-500' :
                          category === 'electricity' ? 'bg-orange-500' :
                          category === 'infrastructure' ? 'bg-indigo-500' :
                          'bg-gray-500'
                        }`} 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
                  </div>
                </div>
              } />
              <Route path="/settings" element={
                <div>
                  <h1 className="text-2xl font-bold mb-6">Configuration</h1>
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <p className="text-gray-500">Fonctionnalité en cours de développement.</p>
                  </div>
                </div>
              } />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

interface AdminDashboardContentProps {
  issues: any[];
  pendingCount: number;
  inProgressCount: number;
  resolvedCount: number;
  rejectedCount: number;
  handleStatusChange: (issueId: string, status: 'pending' | 'in_progress' | 'resolved' | 'rejected') => void;
}

const AdminDashboardContent: React.FC<AdminDashboardContentProps> = ({
  issues,
  pendingCount,
  inProgressCount,
  resolvedCount,
  rejectedCount,
  handleStatusChange
}) => {
  const recentIssues = [...issues]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <div>
          <select className="input py-1 px-3 text-sm">
            <option>Aujourd'hui</option>
            <option>Cette semaine</option>
            <option>Ce mois</option>
            <option>Cette année</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-warning-100 p-3 rounded-full">
              <MapPin className="h-6 w-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">En attente</h2>
              <p className="text-2xl font-bold">{pendingCount}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-warning-500 h-2 rounded-full" 
                style={{ width: `${Math.min(100, (pendingCount / (pendingCount + inProgressCount + resolvedCount)) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-secondary-100 p-3 rounded-full">
              <BarChart className="h-6 w-6 text-secondary-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">En cours</h2>
              <p className="text-2xl font-bold">{inProgressCount}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-secondary-500 h-2 rounded-full" 
                style={{ width: `${Math.min(100, (inProgressCount / (pendingCount + inProgressCount + resolvedCount)) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-success-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-success-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Résolus</h2>
              <p className="text-2xl font-bold">{resolvedCount}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-success-500 h-2 rounded-full" 
                style={{ width: `${Math.min(100, (resolvedCount / (pendingCount + inProgressCount + resolvedCount)) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-warning-100 p-3 rounded-full">
              <MapPin className="h-6 w-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Rejeté</h2>
              <p className="text-2xl font-bold">{rejectedCount}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-warning-500 h-2 rounded-full" 
                style={{ width: `${Math.min(100, (pendingCount / (pendingCount + inProgressCount + resolvedCount)) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium mb-4">Signalements récents</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentIssues.map((issue) => (
                    <tr key={issue.id}>
                      <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">#{issue.id.substring(0, 5)}</td>
                      <td className="px-2 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{issue.title}</div>
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 capitalize">{issue.category.replace('_', ' ')}</div>
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap">
                        <StatusBadge status={issue.status} />
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap text-sm font-medium">
                        <select
                          value={issue.status}
                          onChange={(e) => handleStatusChange(issue.id, e.target.value as any)}
                          className="text-sm rounded-md border-gray-300 py-1 px-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="pending">En attente</option>
                          <option value="in_progress">En cours</option>
                          <option value="resolved">Résolu</option>
                          <option value="rejected">Rejeté</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-right">
              <Link to="/admin/issues" className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                Voir tous les signalements →
              </Link>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-medium mb-4">Répartition par catégorie</h2>
            <div className="space-y-4">
              {['lighting', 'waste', 'road', 'water', 'electricity', 'infrastructure', 'other'].map((category) => {
                const count = issues.filter(issue => issue.category === category).length;
                const percentage = Math.round((count / issues.length) * 100) || 0;
                
                return (
                  <div key={category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 capitalize">{category.replace('_', ' ')}</span>
                      <span className="font-medium">{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          category === 'lighting' ? 'bg-yellow-500' :
                          category === 'waste' ? 'bg-green-500' :
                          category === 'road' ? 'bg-gray-500' :
                          category === 'water' ? 'bg-blue-500' :
                          category === 'electricity' ? 'bg-orange-500' :
                          category === 'infrastructure' ? 'bg-indigo-500' :
                          'bg-gray-500'
                        }`} 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium mb-4">Aperçu de la carte</h2>
            <div className="rounded-lg overflow-hidden h-48 mb-4">
              <IssueMap issues={issues} height="100%" />
            </div>
            <Link to="/admin/map" className="text-primary-600 hover:text-primary-800 text-sm font-medium">
              Ouvrir la carte complète →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;