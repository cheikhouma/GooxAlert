import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  MapPin,
  Users,
  Settings,
  BarChart,
  LogOut,
  Menu,
  X,
  Search,
  Filter
} from 'lucide-react';
import IssueMap from '../components/map/IssueMap';
import StatusBadge from '../components/issues/StatusBadge';
import { useIssues } from "../contexts/IssueContext.tsx";

const AdminDashboardPage = () => {
  const { issues, updateIssueStatus } = useIssues();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('issues');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filteredIssues, setFilteredIssues] = useState(issues);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    let filtered = [...issues];

    // Appliquer le filtre de recherche
    if (searchTerm) {
      filtered = filtered.filter(issue => 
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Appliquer le filtre de statut
    if (statusFilter) {
      filtered = filtered.filter(issue => issue.status === statusFilter);
    }

    // Appliquer le filtre de catégorie
    if (categoryFilter) {
      filtered = filtered.filter(issue => issue.category === categoryFilter);
    }

    // Appliquer le tri
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'desc' ? comparison : -comparison;
    });

    setFilteredIssues(filtered);
  }, [issues, searchTerm, statusFilter, categoryFilter, sortBy, sortOrder]);

  const getCategoryLabel = (category: string) => {
    const categories: { [key: string]: string } = {
      'lighting': 'Éclairage',
      'waste': 'Déchets',
      'road': 'Route',
      'water': 'Eau',
      'electricity': 'Électricité',
      'infrastructure': 'Infrastructure',
      'other': 'Autre'
    };
    return categories[category] || category;
  };

  const pendingIssues = issues.filter(issue => issue.status === 'pending');
  const inProgressIssues = issues.filter(issue => issue.status === 'in_progress');
  const resolvedIssues = issues.filter(issue => issue.status === 'resolved');
  const rejectedIssues = issues.filter(issue => issue.status === 'rejected');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleStatusChange = async (issueId: string, status: 'pending' | 'in_progress' | 'resolved' | 'rejected') => {
    await updateIssueStatus(issueId, status);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const Sidebar = () => (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-200 ease-in-out`}>
      <div className="flex items-center justify-between h-16 bg-gray-900 px-4">
        <div className="flex items-center">
          <MapPin className="h-8 w-8 text-primary-500" />
          <span className="ml-2 text-white font-bold">Admin GooxAlert</span>
        </div>
        <button onClick={toggleSidebar} className="lg:hidden text-gray-300 hover:text-white">
          <X className="h-6 w-6" />
        </button>
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
          onClick={() => {
            setActiveTab('issues');
            setIsSidebarOpen(false);
          }}
        >
          <LayoutDashboard className="h-5 w-5 mr-3" />
          Tableau de bord
        </Link>
        
        <Link
          to="/admin/map"
          className={`flex items-center px-4 py-3 ${activeTab === 'map' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
          onClick={() => {
            setActiveTab('map');
            setIsSidebarOpen(false);
          }}
        >
          <MapPin className="h-5 w-5 mr-3" />
          Carte des signalements
        </Link>
        
        <Link
          to="/admin/users"
          className={`flex items-center px-4 py-3 ${activeTab === 'users' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
          onClick={() => {
            setActiveTab('users');
            setIsSidebarOpen(false);
          }}
        >
          <Users className="h-5 w-5 mr-3" />
          Utilisateurs
        </Link>
        
        <Link
          to="/admin/stats"
          className={`flex items-center px-4 py-3 ${activeTab === 'stats' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
          onClick={() => {
            setActiveTab('stats');
            setIsSidebarOpen(false);
          }}
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
          onClick={() => {
            setActiveTab('settings');
            setIsSidebarOpen(false);
          }}
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
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-gray-800 h-16 flex items-center px-4">
        <button onClick={toggleSidebar} className="text-gray-300 hover:text-white">
          <Menu className="h-6 w-6" />
        </button>
        <div className="flex items-center ml-4">
          <MapPin className="h-8 w-8 text-primary-500" />
          <span className="ml-2 text-white font-bold">Admin GooxAlert</span>
        </div>
      </div>

      <Sidebar />

      {/* Main content */}
      <div className="lg:ml-64 flex-1 pt-16 lg:pt-0">
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={
              <AdminDashboardContent
                issues={issues}
                pendingCount={pendingIssues.length}
                inProgressCount={inProgressIssues.length}
                resolvedCount={resolvedIssues.length}
                rejectedCount={rejectedIssues.length}
                handleStatusChange={handleStatusChange}
              />
            } />
            <Route path="/map" element={
              <div>
                <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Carte des signalements</h1>
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                  <IssueMap issues={issues} height="calc(100vh - 12rem)" showAllIssues={true} />
                </div>
              </div>
            } />
            <Route path="/issues" element={
              <div>
                <div className="flex flex-col gap-4 mb-6">
                  <h1 className="text-xl sm:text-2xl font-bold">Tous les signalements</h1>
                  
                  {/* Search and filters */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 flex-row">
                      <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Rechercher un signalement..."
                        className="input pl-10 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex flex-wrap gap-4">
                      <select 
                        className="input py-2 px-3"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="">Tous les statuts</option>
                        <option value="pending">En attente</option>
                        <option value="in_progress">En cours</option>
                        <option value="resolved">Résolu</option>
                        <option value="rejected">Rejeté</option>
                      </select>
                      
                      <select
                        className="input py-2 px-3"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                      >
                        <option value="">Toutes les catégories</option>
                        <option value="lighting">Éclairage</option>
                        <option value="waste">Déchets</option>
                        <option value="road">Route</option>
                        <option value="water">Eau</option>
                        <option value="electricity">Électricité</option>
                        <option value="infrastructure">Infrastructure</option>
                        <option value="other">Autre</option>
                      </select>

                      <select
                        className="input py-2 px-3"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="date">Trier par date</option>
                        <option value="status">Trier par statut</option>
                        <option value="category">Trier par catégorie</option>
                      </select>

                      <button
                        onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                        className="input py-2 px-3 flex items-center gap-2"
                      >
                        <Filter className="h-4 w-4" />
                        {sortOrder === 'desc' ? 'Décroissant' : 'Croissant'}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredIssues.map((issue) => (
                          <tr key={issue.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">#{issue.id.substring(0, 8)}</td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{issue.title}</div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm text-gray-500 max-w-xs truncate">{issue.description}</div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{getCategoryLabel(issue.category)}</div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {new Date(issue.createdAt).toLocaleDateString('fr-FR', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <StatusBadge status={issue.status} />
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm">
                              <select
                                value={issue.status}
                                onChange={(e) => handleStatusChange(issue.id, e.target.value as any)}
                                className="input py-1 px-2 text-sm"
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
                  {filteredIssues.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      Aucun signalement trouvé
                    </div>
                  )}
                </div>
              </div>
            } />
            <Route path="/users" element={
              <div>
                <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Gestion des utilisateurs</h1>
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                  <p className="text-gray-500">Fonctionnalité en cours de développement.</p>
                </div>
              </div>
            } />
            <Route path="/stats" element={
              <div>
                <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Statistiques</h1>
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                  <div className="space-y-4">
                    {[
                      { id: 'lighting', label: 'Éclairage' },
                      { id: 'waste', label: 'Déchets' },
                      { id: 'road', label: 'Voirie' },
                      { id: 'water', label: 'Eau' },
                      { id: 'electricity', label: 'Électricité' },
                      { id: 'infrastructure', label: 'Infrastructure' },
                      { id: 'other', label: 'Autre' }
                    ].map(({ id, label }) => {
                      const count = issues.filter(issue => issue.category === id).length;
                      const percentage = Math.round((count / issues.length) * 100) || 0;
                      
                      return (
                        <div key={id}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-700">{label}</span>
                            <span className="font-medium">{percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                id === 'lighting' ? 'bg-yellow-500' :
                                id === 'waste' ? 'bg-green-500' :
                                id === 'road' ? 'bg-gray-500' :
                                id === 'water' ? 'bg-blue-500' :
                                id === 'electricity' ? 'bg-orange-500' :
                                id === 'infrastructure' ? 'bg-indigo-500' :
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
            } />
            <Route path="/settings" element={
              <div>
                <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Configuration</h1>
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                  <p className="text-gray-500">Fonctionnalité en cours de développement.</p>
                </div>
              </div>
            } />
          </Routes>
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