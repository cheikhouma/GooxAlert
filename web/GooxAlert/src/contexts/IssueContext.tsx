import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

// Types
interface Signalement {
  id: number;
  title: string;
  description: string;
  image_url: string | null;
  location: string;
  category: string;
  status: 'en_attente' | 'en_cours' | 'resolu' | 'rejected';
  created_at: string;
  user: number;
}

interface IssueContextType {
  issues: Signalement[];
  userIssues: Signalement[];
  getIssueById: (id: number) => Signalement | undefined;
  addIssue: (issueData: Omit<Signalement, 'id' | 'created_at' | 'status' | 'user'>) => Promise<Signalement>;
  updateIssueStatus: (id: number, status: Signalement['status']) => Promise<void>;
  loading: boolean;
  error: string | null;
  getIssue: (id: number) => Promise<Signalement>;
  updateIssue: (id: number, issueData: Partial<Signalement>) => Promise<void>;
  deleteIssue: (id: number) => Promise<void>;
  refreshIssues: () => Promise<void>;
}

const API_URL = 'http://localhost:8000/signalement';

const IssueContext = createContext<IssueContextType | undefined>(undefined);

export const useIssues = () => {
  const context = useContext(IssueContext);
  if (!context) {
    throw new Error('useIssues must be used within an IssueProvider');
  }
  return context;
};

export const IssueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [issues, setIssues] = useState<Signalement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, logout } = useAuth();
  const lastFetchRef = useRef<number>(0);
  const isFetchingRef = useRef<boolean>(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const getAuthHeader = useCallback(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Token d\'authentification manquant');
    }
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  }, []);

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  const fetchIssues = useCallback(async (force = false) => {
    // Éviter les requêtes simultanées
    if (isFetchingRef.current) {
      return;
    }

    // Ne pas rafraîchir si moins de 30 secondes se sont écoulées depuis le dernier fetch
    // sauf si force = true ou si c'est le premier chargement
    const now = Date.now();
    if (!force && now - lastFetchRef.current < 30000 && issues.length > 0) {
      return;
    }

    try {
      isFetchingRef.current = true;
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Session expirée. Veuillez vous reconnecter.');
        stopPolling();
        logout();
        return;
      }

      const response = await axios.get(`${API_URL}/api/signalement/`, getAuthHeader());
      
      if (response.data) {
        setIssues(response.data);
        lastFetchRef.current = now;
      }
    } catch (err: any) {
      console.error('Error fetching issues:', err);
      if (err.response) {
        if (err.response.status === 401) {
          setError('Session expirée. Veuillez vous reconnecter.');
          stopPolling();
          logout();
        } else if (err.response.status === 403) {
          setError('Accès non autorisé.');
          stopPolling();
        } else {
          setError(`Erreur serveur: ${err.response.status}`);
        }
      } else if (err.request) {
        setError('Impossible de joindre le serveur. Vérifiez votre connexion internet.');
      } else {
        setError('Une erreur est survenue lors du chargement des signalements');
      }
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [getAuthHeader, issues.length, logout, stopPolling]);

  // Rafraîchir les données quand l'utilisateur change
  useEffect(() => {
    if (user) {
      // Premier chargement forcé
      fetchIssues(true);

      // Mettre en place le polling toutes les 2 minutes
      pollingIntervalRef.current = setInterval(() => {
        fetchIssues();
      }, 120000); // 2 minutes

      return () => {
        stopPolling();
        isFetchingRef.current = false;
      };
    } else {
      // Réinitialiser les données quand l'utilisateur se déconnecte
      setIssues([]);
      setError(null);
      stopPolling();
    }
  }, [user, fetchIssues, stopPolling]);

  // Les signalements de l'utilisateur sont déjà filtrés par l'API
  const userIssues = issues;

  const getIssueById = useCallback((id: number) => {
    return issues.find(issue => issue.id === id);
  }, [issues]);

  const addIssue = async (issueData: Omit<Signalement, 'id' | 'created_at' | 'status' | 'user'>) => {
    try {
      setError(null);
      const response = await axios.post(
        `${API_URL}/api/signalement/`,
        issueData,
        getAuthHeader()
      );
      const newIssue = response.data;
      // Rafraîchir immédiatement les données
      await fetchIssues(true);
      return newIssue;
    } catch (err) {
      console.error('Error adding issue:', err);
      setError('Erreur lors de l\'ajout du signalement');
      throw err;
    }
  };

  const updateIssueStatus = async (id: number, status: Signalement['status']) => {
    try {
      setError(null);
      await axios.patch(
        `${API_URL}/api/signalement/${id}/`,
        { status },
        getAuthHeader()
      );
      // Rafraîchir immédiatement les données
      await fetchIssues(true);
    } catch (err) {
      console.error('Error updating issue status:', err);
      setError('Erreur lors de la mise à jour du statut');
      throw err;
    }
  };

  const getIssue = async (id: number): Promise<Signalement> => {
    try {
      setError(null);
      const response = await axios.get(
        `${API_URL}/api/signalement/${id}/`,
        getAuthHeader()
      );
      return response.data;
    } catch (err) {
      setError('Erreur lors de la récupération du signalement');
      throw err;
    }
  };

  const updateIssue = async (id: number, issueData: Partial<Signalement>) => {
    try {
      setError(null);
      await axios.patch(
        `${API_URL}/api/signalement/${id}/`,
        issueData,
        getAuthHeader()
      );
      // Rafraîchir immédiatement les données
      await fetchIssues(true);
    } catch (err) {
      setError('Erreur lors de la modification du signalement');
      throw err;
    }
  };

  const deleteIssue = async (id: number) => {
    try {
      setError(null);
      await axios.delete(
        `${API_URL}/api/signalement/${id}/`,
        getAuthHeader()
      );
      // Rafraîchir immédiatement les données
      await fetchIssues(true);
    } catch (err) {
      setError('Erreur lors de la suppression du signalement');
      throw err;
    }
  };

  const refreshIssues = async () => {
    await fetchIssues(true);
  };

  const value = {
    issues,
    userIssues,
    getIssueById,
    addIssue,
    updateIssueStatus,
    loading,
    error,
    getIssue,
    updateIssue,
    deleteIssue,
    refreshIssues
  };

  return (
    <IssueContext.Provider value={value}>
      {children}
    </IssueContext.Provider>
  );
};