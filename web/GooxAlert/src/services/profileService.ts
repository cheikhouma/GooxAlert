import axios from 'axios';
import { User } from '../types';
import { UpdateProfileData } from '../types/index';

const API_URL = 'http://localhost:8000/auth/api';

/**
 * Valide les données de mise à jour du profil
 */

const validateProfileData = (data: UpdateProfileData): void => {

  const newErrors: { [key: string]: string } = {};


  // Si on met à jour le nom
  if (data.full_name !== undefined && data.full_name.trim().length < 2) {
    newErrors["full_name"] = "Le nom doit contenir au moins 2 caractères";
  }

  // Si on met à jour le téléphone
  if (data.telephone !== undefined) {
    // Nettoyer le numéro de téléphone
    const cleanPhone = data.telephone.replace(/\s+/g, '');
    
    // Accepter les formats suivants :
    // - +221 7x xxxx xxx
    // - 00221 7x xxxx xxx
    // - 7x xxxx xxx
    // - 0 7x xxxx xxx
    if (!cleanPhone.match(/^(\+221|00221)?[0-9]{9}$/) && 
        !cleanPhone.match(/^0?[0-9]{9}$/) && 
        !cleanPhone.match(/^[0-9]{9}$/)) {
      newErrors["telephone"] = "Format invalide. Exemples acceptés : +221 77 123 45 67, 00221 77 123 45 67, 77 123 45 67, 077 123 45 67";
    }
  }

  // Si on met à jour la commune
  if (data.commune !== undefined && data.commune.trim().length < 2) {
    newErrors["commune"] = "La commune doit contenir au moins 2 caractères";
    throw new Error('La commune doit contenir au moins 2 caractères');
  }
  if (Object.keys(newErrors).length > 0) {
    throw new Error(JSON.stringify(newErrors));
  }

};

/**
 * Met à jour les informations du profil utilisateur
 */
export const updateProfile = async (userData: UpdateProfileData): Promise<User> => {

  try {
    console.log('[ProfileService] Début de la mise à jour du profil');
    console.log('[ProfileService] Données à mettre à jour:', userData);

    // Validation des données
    validateProfileData(userData);

    // Préparation des données à envoyer
    const dataToSend = {
      ...(userData.full_name !== undefined && { full_name: userData.full_name.trim() }),
      ...(userData.telephone !== undefined && { telephone: userData.telephone.trim() }),
      ...(userData.commune !== undefined && { commune: userData.commune.trim() }),
      ...(userData.image_url !== undefined && { image_url: userData.image_url })
    };

    // Vérification du token
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('[ProfileService] Token non trouvé');
      throw new Error('Session expirée. Veuillez vous reconnecter.');
    }

    console.log('[ProfileService] Données préparées à envoyer:', dataToSend);

    // Envoi de la requête
    const response = await axios.put(
      `${API_URL}/update-personal-info/`,
      dataToSend,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Vérification de la réponse
    if (!response.data) {
      console.error('[ProfileService] Réponse invalide du serveur');
      throw new Error('Réponse invalide du serveur');
    }

    console.log('[ProfileService] Réponse du serveur:', response.data);
    const { user, tokens } = response.data;

    if (tokens) {
      localStorage.setItem('accessToken', tokens.access);
      localStorage.setItem('refreshToken', tokens.refresh);
    }

    return user;

  } catch (error) {
    let errorMessages = {};

    if (error instanceof Error) {
      try {
        errorMessages = JSON.parse(error.message);
      } catch (e) {
        // not JSON, maybe a generic message
        console.error('Non-JSON error:', error.message);
      }
    }

    console.log('Validation errors:', errorMessages);
    // You can now display errorMessages["full_name"], etc. in your form
    console.error('[ProfileService] Erreur lors de la mise à jour du profil:', {
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      ...(axios.isAxiosError(error) && {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      })
    });

    if (axios.isAxiosError(error)) {
      // Gestion des erreurs HTTP
      switch (error.response?.status) {
        case 401:
          console.error('[ProfileService] Erreur 401: Session expirée');
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        case 400:
          console.error('[ProfileService] Erreur 400:', error.response.data);
          throw new Error(error.response.data.message || 'Données invalides');
        case 500:
          console.error('[ProfileService] Erreur 500: Erreur serveur');
          throw new Error('Erreur serveur. Veuillez réessayer plus tard.');
        default:
          console.error('[ProfileService] Erreur inconnue:', error.response?.data);
          throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour du profil');
      }
    }
    // Gestion des autres erreurs
    throw error instanceof Error ? error : new Error('Erreur inconnue lors de la mise à jour du profil');
  }
}; 



export async function updatePassword(oldPassword: string, newPassword: string) {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.post(
      `${API_URL}/modifier-mot-de-passe/`,
      {
        old_password: oldPassword,
        new_password: newPassword,
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
      }
    );
    return response.data; // contient status, message, tokens
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Erreur côté serveur (ex: mauvais mot de passe)
      return error.response?.data;
    }
    // Erreur réseau ou autre
    throw error;
  }
}
