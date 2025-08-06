import axios from 'axios';

const API_URL = 'http://localhost:8000/signalement/api/signalement/'; // ajuste selon ton backend

export const createSignalement = async (data: any, token: string) => {
  return axios.post(API_URL, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};
