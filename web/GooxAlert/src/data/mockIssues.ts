import { Issue } from '../types';

export const mockIssues: Issue[] = [
  {
    id: '1',
    title: 'Panneau de signalisation endommagé',
    description: 'Un panneau de signalisation est tombé sur la route principale',
    category: 'infrastructure',
    status: 'pending',
    location: {
      lat: 14.7167,
      lng: -17.4677,
      address: 'Avenue Cheikh Anta Diop, Dakar'
    },
    imageUrl: 'https://example.com/image1.jpg',
    userId: 'user1',
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Éclairage public défectueux',
    description: 'Plusieurs lampadaires ne fonctionnent pas dans le quartier',
    category: 'lighting',
    status: 'in_progress',
    location: {
      lat: 14.7167,
      lng: -17.4677,
      address: 'Rue 10, Dakar'
    },
    imageUrl: 'https://example.com/image2.jpg',
    userId: 'user2',
    createdAt: '2024-03-14T15:30:00Z',
    updatedAt: '2024-03-14T15:30:00Z'
  },
  {
    id: '3',
    title: 'Déchets non collectés',
    description: 'Les poubelles n\'ont pas été vidées depuis plusieurs jours',
    category: 'waste',
    status: 'resolved',
    location: {
      lat: 14.7167,
      lng: -17.4677,
      address: 'Avenue Bourguiba, Dakar'
    },
    imageUrl: 'https://example.com/image3.jpg',
    userId: 'user3',
    createdAt: '2024-03-13T09:15:00Z',
    updatedAt: '2024-03-13T09:15:00Z'
  },
  {
    id: '4',
    title: 'Nid de poule dangereux',
    description: 'Grand trou dans la chaussée qui peut endommager les véhicules',
    category: 'road',
    status: 'pending',
    location: {
      lat: 14.7167,
      lng: -17.4677,
      address: 'Boulevard de la République, Dakar'
    },
    imageUrl: 'https://example.com/image4.jpg',
    userId: 'user1',
    createdAt: '2024-03-12T14:45:00Z',
    updatedAt: '2024-03-12T14:45:00Z'
  },
  {
    id: '5',
    title: 'Fuite d\'eau',
    description: 'Fuite importante sur la canalisation principale',
    category: 'water',
    status: 'in_progress',
    location: {
      lat: 14.7167,
      lng: -17.4677,
      address: 'Rue des Écoles, Dakar'
    },
    imageUrl: 'https://example.com/image5.jpg',
    userId: 'user2',
    createdAt: '2024-03-11T11:20:00Z',
    updatedAt: '2024-03-11T11:20:00Z'
  }
];