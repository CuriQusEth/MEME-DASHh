import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {AppContent} from './App.tsx';
import {Web3Provider} from './providers/Web3Provider.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Web3Provider>
      <AppContent />
    </Web3Provider>
  </StrictMode>,
);
