import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDebounce } from 'react-use';
import './App.css'
import config from './config';
import Search from './components/Search'
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import PaginationButton from './components/PaginationButton';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialPage = parseInt(queryParams.get('page') || '1', 10);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  
  const [movieList, setMovieList] = useState([])
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [trendingMoviesList, setTrendingMoviesList] = useState([])
  const [trendingMovieErrorMessage, setTrendingMovieErrorMessage] = useState('')
  const [isTrendingLoading, setIsTrendingLoading] = useState(false)

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1); // 

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

  const fetchMovies = async (query = '', page = 1) => {
    setIsLoading(true); 

    try{
      const endpoint = query 
      ? `${config.API_BASE_URL}/search/movie?query=${encodeURI(query)}&page=${page}`
      : `${config.API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}`;

      const response = await fetch(endpoint, config.API_OPTIONS)
      
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
      setTotalPages(data.total_pages > 500 ? 500 : data.total_pages); 

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
      const response = await fetch(`${config.TRENDING_API_BASE_URL}/trending-movies`);

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
      const response = await fetch(`${config.TRENDING_API_BASE_URL}/update-trending-movies`, {
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
    fetchMovies(debouncedSearchTerm, currentPage);

  }, [debouncedSearchTerm, currentPage])

  useEffect(() => {
    console.log("Fetching trending movies...");
    fetchTrendingMovies();
  }, [])
  
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      navigate(`?page=${newPage}`);
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxPagesToShow = 5; 

    pages.push(
      <PaginationButton
        key={1}
        onClick={() => handlePageChange(1)}
        isActive={currentPage === 1}
      >
        1
      </PaginationButton>
    );

    // Add ellipsis if the current page is far from the first page
    if (currentPage > maxPagesToShow - 2) {
      pages.push(<span key="ellipsis-start" className="px-4 py-2 text-white">. . .</span>);
    }

    // Add pages around the current page
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(
        <PaginationButton
          key={i}
          onClick={() => handlePageChange(i)}
          isActive={currentPage === i}
        >
          {i}
        </PaginationButton>
      );
    }

    // Add ellipsis if the current page is far from the last page
    if (currentPage <= totalPages - maxPagesToShow + 2) {
      pages.push(<span key="ellipsis-end" className="px-4 py-2 text-white">. . .</span>);
    }

    if (totalPages > 1) {
      pages.push(
        <PaginationButton
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          isActive={currentPage === totalPages}
        >
          {totalPages}
        </PaginationButton>
      );
    }

    return pages;
  };

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
                <Link to={`/movie/${movie.movie_id}`} >
                <li key={movie.id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
                </Link>
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
            <>
              <ul>
                {movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie}/>
                ))}
              </ul>

              {/* Pagination Controls */}
              <div className="flex justify-center gap-2 mt-8 flex-wrap">
                <PaginationButton
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  hoverColor="bg-indigo-500"
                >
                  Previous
                </PaginationButton>
                {renderPagination()}
                <PaginationButton
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  hoverColor="bg-indigo-500"
                >
                  Next
                </PaginationButton>
              </div>
            </>
          )
        }
        </section>
      </div>

    </main>
  )
}

export default App;