import axios from "axios";

const API_URL = 'http://localhost:8000/auth/api';

interface RegisterData {
  full_name: string;
  telephone: string;
  commune: string;
  password: string;
}

interface LoginData {
  telephone: string;
  password: string;
}

export async function register(data: RegisterData) {
  const response = await fetch(`${API_URL}/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    mode: 'cors',
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Erreur d\'inscription');
  }

  return response.json();
}

export async function login(data: LoginData) {
  const response = await fetch(`${API_URL}/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    mode: 'cors',
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Identifiants invalides');
  }

  const responseData = await response.json();

  // Stockage des tokens dans localStorage
  localStorage.setItem('accessToken', responseData.tokens.access);
  localStorage.setItem('refreshToken', responseData.tokens.refresh);

  return responseData;
}

// Première étape : vérifier le numéro
export const checkPhone = async (telephone: string) => {
  const response = await axios.post(`${API_URL}/demande-reinitialisation/`, { telephone });
  return response.data;
};

// Deuxième étape : réinitialiser le mot de passe
export const resetPassword = async (telephone: string, newPassword: string) => {
  const response = await axios.post(`${API_URL}/reinitialiser-mot-de-passe/`, {
    telephone,
    new_password: newPassword
  });
  return response.data;
};