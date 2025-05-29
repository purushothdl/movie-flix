// src/api/movieApi.js
import config from '../config';

export const fetchMovies = async (query = '', page = 1) => {
  try {
    const endpoint = query
      ? `${config.API_BASE_URL}/search/movie?query=${encodeURI(query)}&page=${page}`
      : `${config.API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}`;
    const response = await fetch(endpoint, config.API_OPTIONS);
    if (!response.ok) throw new Error('Failed to fetch movies');
    const data = await response.json();
    if (data.Response === 'False') throw new Error(data.Error || 'Failed to fetch movies');
    return { results: data.results || [], totalPages: data.total_pages > 500 ? 500 : data.total_pages };
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

export const fetchMovieDetails = async (id) => {
  try {
    const response = await fetch(
      `${config.API_BASE_URL}/movie/${id}`,
      config.API_OPTIONS
    );
    if (!response.ok) throw new Error('Failed to fetch movie details');
    return await response.json();
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};