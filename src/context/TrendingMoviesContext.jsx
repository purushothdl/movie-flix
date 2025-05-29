import { createContext, useState, useEffect } from 'react';
import { fetchTrendingMovies } from '../api/trendingApi';

export const TrendingMoviesContext = createContext();

export const TrendingMoviesProvider = ({ children }) => {
  const [trendingMoviesList, setTrendingMoviesList] = useState([]);
  const [trendingMovieErrorMessage, setTrendingMovieErrorMessage] = useState('');
  const [isTrendingLoading, setIsTrendingLoading] = useState(false);

  useEffect(() => {
    const loadTrendingMovies = async () => {
      setIsTrendingLoading(true);
      try {
        const movies = await fetchTrendingMovies();
        setTrendingMoviesList(movies);
      } catch (error) {
        setTrendingMovieErrorMessage('Error fetching trending movies');
      } finally {
        setIsTrendingLoading(false);
      }
    };
    loadTrendingMovies();
  }, []);

  return (
    <TrendingMoviesContext.Provider
      value={{ trendingMoviesList, trendingMovieErrorMessage, isTrendingLoading }}
    >
      {children}
    </TrendingMoviesContext.Provider>
  );
}; 