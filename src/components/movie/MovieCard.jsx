// src/components/movie/MovieCard.jsx
import { Link } from 'react-router-dom';
import { IMAGE_BASE_URL, POSTER_SIZE } from '../../utils/constants';
import '../../index.css';

const MovieCard = ({ movie }) => {
  return (
    <Link to={`/movie/${movie.id}`} className="movie-card">
      <img
        src={movie.poster_path ? `${IMAGE_BASE_URL}/${POSTER_SIZE}/${movie.poster_path}` : '/no-movie.png'}
        alt={movie.title}
      />
      <div className="mt-4">
        <h3>{movie.title}</h3>
        <div className="content">
          <div className="rating">
            <img src="/star.svg" alt="Star Icon" />
            <p>{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</p>
          </div>
          <span>•</span>
          <p className="lang">{movie.original_language}</p>
          <span>•</span>
          <p className="year">{movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</p>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;