import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { IssueProvider } from './contexts/IssueContext';

const router = createBrowserRouter([
  {
    path: '/*',
    element: <App />,
  }
], {
  future: {
    v7_startTransition: true
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <IssueProvider>
        <RouterProvider router={router} />
      </IssueProvider>
    </AuthProvider>
  </React.StrictMode>
);