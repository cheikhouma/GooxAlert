import React, {createContext, useEffect, useState} from 'react';
import {Issue, IssueStatus} from '../types';
import {mockIssues} from '../data/mockIssues';
// Helper for the AuthContext
import {useAuth} from './AuthContext';

interface IssueContextType {
  issues: Issue[];
  userIssues: Issue[];
  getIssueById: (id: string) => Issue | undefined;
  addIssue: (issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<Issue>;
  updateIssueStatus: (id: string, status: IssueStatus) => Promise<void>;
}

const IssueContext = createContext<IssueContextType | undefined>(undefined);
import {useContext} from "react";

export const useIssues = () => {
  const context = useContext(IssueContext);
  if (context === undefined) {
    throw new Error('useIssues must be used within an IssueProvider');
  }
  return context;
};
export const IssueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // In a real app, this would fetch from an API
    const storedIssues = localStorage.getItem('smartDakarIssues');
    if (storedIssues) {
      setIssues(JSON.parse(storedIssues));
    } else {
      setIssues(mockIssues);
      localStorage.setItem('smartDakarIssues', JSON.stringify(mockIssues));
    }
  }, []);

  // Get issues created by the current user
  const userIssues = user 
    ? issues.filter(issue => issue.userId === user.id)
    : [];

  const getIssueById = (id: string) => {
    return issues.find(issue => issue.id === id);
  };

  const addIssue = async (issueData: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const now = new Date().toISOString();
    const newIssue: Issue = {
      id: Math.random().toString(36).substr(2, 9),
      createdAt: now,
      updatedAt: now,
      status: 'pending',
      ...issueData,
      
    };

    const updatedIssues = [...issues, newIssue];
    setIssues(updatedIssues);
    localStorage.setItem('smartDakarIssues', JSON.stringify(updatedIssues));
    return newIssue;
  };

  const updateIssueStatus = async (id: string, status: IssueStatus) => {
    const updatedIssues = issues.map(issue => 
      issue.id === id 
        ? { ...issue, status, updatedAt: new Date().toISOString() } 
        : issue
    );
    
    setIssues(updatedIssues);
    localStorage.setItem('smartDakarIssues', JSON.stringify(updatedIssues));
  };




  const value = {
    issues,
    userIssues,
    getIssueById,
    addIssue,
    updateIssueStatus,
  };

  return (
    <IssueContext.Provider value={value}>
      {children}
    </IssueContext.Provider>
  );
};

