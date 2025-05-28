// src/api/trendingApi.js
import config from '../config';

export const fetchTrendingMovies = async () => {
  try {
    const response = await fetch(`${config.TRENDING_API_BASE_URL}/trending-movies`);
    if (!response.ok) throw new Error('Failed to fetch trending movies');
    const data = await response.json();
    return data.movies;
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    throw error;
  }
};

export const updateTrendingMovies = async (movie, searchTerm) => {
  try {
    const response = await fetch(`${config.TRENDING_API_BASE_URL}/update-trending-movies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ movie, search_term: searchTerm }),
    });
    if (!response.ok) throw new Error('Failed to update trending movies');
    console.log('Trending movies updated successfully');
  } catch (error) {
    console.error('Error updating trending movies:', error);
    throw error;
  }
};