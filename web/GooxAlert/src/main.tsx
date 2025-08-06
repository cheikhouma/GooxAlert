import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { IssueProvider } from './contexts/IssueContext';
import 'leaflet/dist/leaflet.css';

const router = createBrowserRouter([
  {
    path: '/*',
    element: <App />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <IssueProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </IssueProvider>
    </AuthProvider>
  </React.StrictMode>
);