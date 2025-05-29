// src/pages/Home.jsx
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Search from '../components/common/Search';
import Spinner from '../components/common/Spinner';
import MovieCard from '../components/movie/MovieCard';
import Pagination from '../components/common/Pagination';
import { useMovies } from '../hooks/useMovies';

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialPage = parseInt(queryParams.get('page') || '1', 10);

  const {
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
  } = useMovies(initialPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      navigate(`?page=${newPage}`);
    }
  };

  return (
    <main>
      <div className="pattern"></div>
      <div className="wrapper">
        <header>
          <img src="/hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {isTrendingLoading ? (
          <Spinner />
        ) : trendingMovieErrorMessage ? (
          <p className="text-red-500 mt-10 mb-10 text-center">{trendingMovieErrorMessage}</p>
        ) : trendingMoviesList.length > 0 ? (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMoviesList.map((movie, index) => (
                <Link to={`/movie/${movie.movie_id}`} key={movie.id}>
                  <li>
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

        <section className="all-movies">
          <h2>All Movies</h2>
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500 mt-10 mb-10 text-center">{errorMessage}</p>
          ) : (
            <>
              <ul>
                {movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>
              <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
            </>
          )}
        </section>
      </div>
    </main>
  );
};

export default Home;