import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { IssueProvider } from './contexts/IssueContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <IssueProvider>
          <App />
        </IssueProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);