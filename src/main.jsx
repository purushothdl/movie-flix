import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import AppRoutes from './routes';
import { TrendingMoviesProvider } from './context/TrendingMoviesContext';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <TrendingMoviesProvider>
      <AppRoutes />
    </TrendingMoviesProvider>
  </BrowserRouter>
);