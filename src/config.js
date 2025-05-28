// src/config.js

const config = {
  API_BASE_URL: 'https://api.themoviedb.org/3',
  API_KEY: import.meta.env.VITE_TMDB_API_KEY,
  TRENDING_API_BASE_URL: import.meta.env.VITE_TRENDING_API_URL,
  
  API_OPTIONS: {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
    },
  },
};

export default config;