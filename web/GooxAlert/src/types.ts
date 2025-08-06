export type IssueCategory = 
  | 'lighting' 
  | 'waste' 
  | 'road' 
  | 'water' 
  | 'electricity'
  | 'infrastructure'
  | 'other';

export type IssueStatus = 
  | 'pending' 
  | 'in_progress' 
  | 'resolved' 
  | 'rejected'
  | 'en_attente'
  | 'en_cours'
  | 'resolu';

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface User {
  id: string;
  full_name: string;
  telephone: string;
  commune: string;
  image_url?: string;
  role: 'user' | 'admin';
}

export interface Signalement {
  id: number;
  title: string;
  description: string;
  category: string | IssueCategory;
  image_url: string | null;
  location: string;
  status: IssueStatus;
  created_at: string;
}