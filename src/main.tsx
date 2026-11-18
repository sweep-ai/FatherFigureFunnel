import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { config } from './data/funnel';
import { initClarity } from './lib/clarity';
import { captureAttribution } from './lib/sweep';
import './styles/tokens.css';
import './styles/global.css';

captureAttribution();
initClarity(config.clarityProjectId);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
