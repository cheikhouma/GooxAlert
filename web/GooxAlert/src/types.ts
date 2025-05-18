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
  | 'rejected';

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  location: Location;
  imageUrl?: string;
  userId: string;
  status: IssueStatus;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  telephone: string;
  avatar?: string;
  role: 'user' | 'admin';
}