export interface User {
  id: string;
  full_name: string;
  telephone: string;
  role: 'user' | 'admin';
  image_url?: string;
  commune?: string;
}

export interface UpdateProfileData {
  full_name?: string;
  telephone?: string;
  commune?: string;
  image_url?: string;
} 

export interface Signalement {
  id: number;
  title: string;
  description: string;
  image_url: string | null;
  location: string;
  category: string;
  status: string;
  created_at: string;
}

export interface ApiResponse {
  status: 'success' | 'error';
  message?: string;
  user?: User;
  tokens?: {
    access: string;
    refresh: string;
  };
}