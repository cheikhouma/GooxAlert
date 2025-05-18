export interface User {
  id: string;
  name: string;
  telephone: string;
  role: 'user' | 'admin';
  avatar: string;
} 