// src/hooks/useMovies.js
import { useState, useEffect, useContext } from 'react';
import { useDebounce } from 'react-use';
import { fetchMovies } from '../api/movieApi';
import { updateTrendingMovies } from '../api/trendingApi';
import { TrendingMoviesContext } from '../context/TrendingMoviesContext';

// Tracks last search to prevent duplicate updates
let lastSearchTermRef = '';

export const useMovies = (initialPage = 1, initialSearch = '') => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialSearch);

  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { trendingMoviesList, trendingMovieErrorMessage, isTrendingLoading } = useContext(TrendingMoviesContext);

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  useEffect(() => {
    const loadMovies = async () => {
      setIsLoading(true);
      try {
        const { results, totalPages } = await fetchMovies(debouncedSearchTerm, currentPage);
        setMovieList(results);
        setTotalPages(totalPages);

        if (debouncedSearchTerm === '') lastSearchTermRef = '';
        if (debouncedSearchTerm && results.length > 0 && debouncedSearchTerm !== lastSearchTermRef) {
          await updateTrendingMovies(results[0], debouncedSearchTerm);
          lastSearchTermRef = debouncedSearchTerm;
        }
      } catch (error) {
        setErrorMessage('Error fetching movies. Please try again later.');
        setMovieList([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadMovies();
  }, [debouncedSearchTerm, currentPage]);

  return {
    searchTerm,
    setSearchTerm,
    movieList,
    errorMessage,
    isLoading,
    trendingMoviesList,
    trendingMovieErrorMessage,
    isTrendingLoading,
    currentPage,
    setCurrentPage,
    totalPages,
  };
};