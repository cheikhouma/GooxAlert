import { Issue } from '../types';

// Central Dakar coordinates
const DAKAR_CENTER = {
  lat: 14.7167,
  lng: -17.4677
};

// Generate some random coordinates around Dakar
const getRandomLocation = () => {
  return {
    lat: DAKAR_CENTER.lat + (Math.random() - 0.5) * 0.1,
    lng: DAKAR_CENTER.lng + (Math.random() - 0.5) * 0.1,
    address: "Dakar, Sénégal"
  };
};

export const mockIssues: Issue[] = [
  {
    id: "1",
    title: "Lampadaire cassé",
    description: "Le lampadaire au coin de la rue ne fonctionne plus depuis deux semaines, créant une zone sombre dangereuse la nuit.",
    category: "lighting",
    location: getRandomLocation(),
    imageUrl: "https://images.pexels.com/photos/1723637/pexels-photo-1723637.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    userId: "1",
    status: "pending",
    createdAt: "2023-11-15T10:23:45Z",
    updatedAt: "2023-11-15T10:23:45Z",
  },
  {
    id: "2",
    title: "Déchets non collectés",
    description: "Accumulation de déchets sur l'avenue principale. Les poubelles débordent depuis plusieurs jours.",
    category: "waste",
    location: getRandomLocation(),
    imageUrl: "https://images.pexels.com/photos/2768113/pexels-photo-2768113.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    userId: "3",
    status: "in_progress",
    createdAt: "2023-11-14T14:15:20Z",
    updatedAt: "2023-11-17T09:45:30Z",
  
  },
  {
    id: "3",
    title: "Nid de poule dangereux",
    description: "Large nid de poule sur la route près de l'école primaire. Plusieurs véhicules ont été endommagés.",
    category: "road",
    location: getRandomLocation(),
    imageUrl: "https://images.pexels.com/photos/2846814/pexels-photo-2846814.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    userId: "5",
    status: "resolved",
    createdAt: "2023-10-28T08:10:15Z",
    updatedAt: "2023-11-01T12:30:45Z",
  },
  {
    id: "4",
    title: "Coupure d'eau fréquente",
    description: "Notre quartier subit des coupures d'eau quotidiennes depuis 10 jours, sans préavis.",
    category: "water",
    location: getRandomLocation(),
    imageUrl: "https://images.pexels.com/photos/1209982/pexels-photo-1209982.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    userId: "7",
    status: "in_progress",
    createdAt: "2023-11-05T16:40:30Z",
    updatedAt: "2023-11-12T13:10:25Z",
  },
  {
    id: "5",
    title: "Câbles électriques exposés",
    description: "Des câbles électriques sont suspendus à hauteur d'homme près du marché.",
    category: "electricity",
    location: getRandomLocation(),
    imageUrl: "https://images.pexels.com/photos/1496273/pexels-photo-1496273.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    userId: "9",
    status: "pending",
    createdAt: "2023-11-18T11:25:40Z",
    updatedAt: "2023-11-18T11:25:40Z",
  }
];