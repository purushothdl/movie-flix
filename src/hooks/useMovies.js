// src/hooks/useMovies.js
import { useState, useEffect } from 'react';
import { useDebounce } from 'react-use';
// import { fetchMovies, fetchTrendingMovies, updateTrendingMovies } from '../api';
import { fetchMovies } from '../api/movieApi';
import { fetchTrendingMovies, updateTrendingMovies } from '../api/trendingApi';

export const useMovies = (initialPage = 1) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [trendingMoviesList, setTrendingMoviesList] = useState([]);
  const [trendingMovieErrorMessage, setTrendingMovieErrorMessage] = useState('');
  const [isTrendingLoading, setIsTrendingLoading] = useState(false);

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
        if (debouncedSearchTerm && results.length > 0) {
          await updateTrendingMovies(results[0], debouncedSearchTerm);
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