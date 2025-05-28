// src/routes.jsx
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MovieDetails from './components/movie/MovieDetails';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/movie/:id" element={<MovieDetails />} />
  </Routes>
);

export default AppRoutes;