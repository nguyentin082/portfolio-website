import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './theme.css';
import './index.css';
import { rememberScroll } from './utils/scrollMemory';
import { applySeason, detectSeason } from './utils/season';

rememberScroll();
applySeason(detectSeason());

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
