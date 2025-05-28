// src/hooks/useMovieDetails.js
import { useState, useEffect } from 'react';
import { fetchMovieDetails } from '../api/movieApi';

export const useMovieDetails = (id) => {
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDetails = async () => {
      setIsLoading(true);
      try {
        const data = await fetchMovieDetails(id);
        setMovie(data);
      } catch (err) {
        setError('Error fetching movie details');
      } finally {
        setIsLoading(false);
      }
    };
    loadDetails();
  }, [id]);

  return { movie, isLoading, error };
};