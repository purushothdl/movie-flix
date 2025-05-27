import { useEffect, useState } from 'react'
import { useDebounce } from 'react-use';
import './App.css'
import Search from './components/Search'
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';

const App = () => {

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  
  const [movieList, setMovieList] = useState([])
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [trendingMoviesList, setTrendingMoviesList] = useState([])
  const [trendingMovieErrorMessage, setTrendingMovieErrorMessage] = useState('')
  const [isTrendingLoading, setIsTrendingLoading] = useState(false)

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

  const API_BASE_URL='https://api.themoviedb.org/3';
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  const TRENDING_API_BASE_URL = import.meta.env.VITE_TRENDING_API_URL

  const API_OPTIONS = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_KEY}`
    }
  }

  const fetchMovies = async (query = '') => {
    setIsLoading(true); 

    try{
      const endpoint = query 
      ? `${API_BASE_URL}/search/movie?query=${encodeURI(query)}`
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS)
      
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json()

      if (data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);

      if (query && data.results.length > 0) {
        await updateTrendingMovies(data.results[0], query);
      }

    } catch(error){
      console.error("Error:", error); 
      setErrorMessage(prev => prev = 'Error fetching movies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  const fetchTrendingMovies = async () => {
    setIsTrendingLoading(true);
    try {
      const response = await fetch(`${TRENDING_API_BASE_URL}/trending-movies`);

      if(!response.ok) {
        throw new Error('Failed to fetch trending movies')
      }
      const data = await response.json();
      setTrendingMoviesList(data.movies);

    } catch(error) {
      console.log('Error fetching trending movies');
      setTrendingMovieErrorMessage('Error fetching trending movies')
    } finally {
      setIsTrendingLoading(false);
    }
  }

  const updateTrendingMovies = async (movie, searchTerm) => {
    try {
      const response = await fetch(`${TRENDING_API_BASE_URL}/update-trending-movies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movie, search_term: searchTerm }),
      });

      if (!response.ok) {
        throw new Error('Failed to update trending movies');
      }

      console.log("Trending movies updated successfully");
    } catch (error) {
      console.error("Error updating trending movies:", error);
    }
  };

  useEffect( () => {
    console.log("Fetching movies..."); 
    fetchMovies(debouncedSearchTerm);

  }, [debouncedSearchTerm])

  useEffect(() => {
    console.log("Fetching trending movies...");
    fetchTrendingMovies();
  }, [])
  

  return(
    <main>
      <div className="pattern"></div>

      <div className="wrapper">
        <header>
          <img src='hero.png' alt="Hero Banner"></img>
          <h1> Find <span className='text-gradient'>Movies</span> You'll Enjoy Without the Hassle </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>        
        </header>

        {isTrendingLoading ? (
          <Spinner />
        ) : trendingMovieErrorMessage ? (
          <p className="text-red-500 mt-10 mb-10">{trendingMovieErrorMessage}</p>
        ) : trendingMoviesList.length > 0 ? (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMoviesList.map((movie, index) => (
                <li key={movie.id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        ) : (
          <p>No trending movies found.</p>
        )}
        
        <section className='all-movies'>
          <h2> All Movies</h2>
          {isLoading ? (
            <Spinner/>
          ) : errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie}/>
              ))}
            </ul>
          )
        }
        </section>
      </div>

    </main>
  )
}

export default App;