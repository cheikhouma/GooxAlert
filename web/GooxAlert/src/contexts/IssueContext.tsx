import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Issue } from '../types';
import { mockIssues } from '../data/mockIssues';

interface IssueContextType {
  issues: Issue[];
  userIssues: Issue[];
  getIssueById: (id: string) => Issue | undefined;
  addIssue: (issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<Issue>;
  updateIssueStatus: (id: string, status: Issue['status']) => Promise<void>;
  loading: boolean;
  error: string | null;
  getIssue: (id: string) => Promise<Issue>;
  updateIssue: (id: string, issueData: Partial<Issue>) => Promise<void>;
  deleteIssue: (id: string) => Promise<void>;
  refreshIssues: () => Promise<void>;
}

const IssueContext = createContext<IssueContextType | undefined>(undefined);

export const useIssues = () => {
  const context = useContext(IssueContext);
  if (!context) {
    throw new Error('useIssues must be used within an IssueProvider');
  }
  return context;
};

export const IssueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchIssues = async () => {
    try {
      setLoading(true);
      setError(null);
      // Utiliser les données mockées au lieu de Supabase
      setIssues(mockIssues);
    } catch (err) {
      console.error('Error fetching issues:', err);
      setError('Erreur lors du chargement des signalements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchIssues();
    }
  }, [user]);

  // Get issues created by the current user
  const userIssues = user 
    ? issues.filter(issue => issue.userId === user.id)
    : [];

  const getIssueById = (id: string) => {
    return issues.find(issue => issue.id === id);
  };

  const addIssue = async (issueData: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    try {
      setError(null);
      const newIssue: Issue = {
        ...issueData,
        id: Math.random().toString(36).substr(2, 9),
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: user?.id || 'anonymous'
      };
      setIssues(prev => [newIssue, ...prev]);
      return newIssue;
    } catch (err) {
      console.error('Error adding issue:', err);
      setError('Erreur lors de l\'ajout du signalement');
      throw err;
    }
  };

  const updateIssueStatus = async (id: string, status: Issue['status']) => {
    try {
      setError(null);
      setIssues(prev => prev.map(issue =>
        issue.id === id ? { ...issue, status, updatedAt: new Date().toISOString() } : issue
      ));
    } catch (err) {
      console.error('Error updating issue status:', err);
      setError('Erreur lors de la mise à jour du statut');
      throw err;
    }
  };

  const getIssue = async (id: string): Promise<Issue> => {
    try {
      setError(null);
      const issue = issues.find(i => i.id === id);
      if (!issue) {
        throw new Error('Signalement non trouvé');
      }
      return issue;
    } catch (err) {
      setError('Erreur lors de la récupération du signalement');
      throw err;
    }
  };

  const updateIssue = async (id: string, issueData: Partial<Issue>) => {
    try {
      setError(null);
      setIssues(prev => prev.map(issue => 
        issue.id === id 
          ? { ...issue, ...issueData, updatedAt: new Date().toISOString() }
          : issue
      ));
    } catch (err) {
      setError('Erreur lors de la modification du signalement');
      throw err;
    }
  };

  const deleteIssue = async (id: string) => {
    try {
      setError(null);
      setIssues(prev => prev.filter(issue => issue.id !== id));
    } catch (err) {
      setError('Erreur lors de la suppression du signalement');
      throw err;
    }
  };

  const refreshIssues = async () => {
    await fetchIssues();
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

