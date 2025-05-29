import { useParams } from 'react-router-dom';
import { useMovieDetails } from '../../hooks/useMovieDetails';
import Spinner from '../common/Spinner';
import { ClockIcon, StarIcon, CalendarIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import '../../index.css'

const MovieDetails = () => {
  const { id } = useParams();
  const { movie, isLoading, error } = useMovieDetails(id);

  if (isLoading) return <Spinner />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!movie) return null;

  return (
    <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 min-h-screen w-full">
      {/* Backdrop Image */}
      <div className="relative">
        <img
          src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
          className="w-full h-156 object-cover"
          alt={movie.title}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/40"></div>
      </div>

      {/* Movie Details Content */}
      <div className="wrapper relative -mt-32 z-10 px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Poster Shadow */}
          <div className="flex-shrink-0">
            <img
              src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
              className="w-64 h-96 rounded-xl shadow-2xl shadow-black/50 border-2 border-white/10"
              alt={movie.title}
            />
          </div>

          {/* Movie Info */}
          <div className="flex-1 pt-8">
            <h1 className="text-5xl font-bold text-white mb-2 leading-tight">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="text-xl italic text-amber-400 mb-6 font-light text-center">
                "{movie.tagline}"
              </p>
            )}
            <p className="text-gray-200 text-lg leading-relaxed max-w-3xl mb-8 mx-auto">
              {movie.overview}
            </p>

            {/* Metadata Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {/* Runtime Card */}
              <div className="metadata-card">
                <div className="flex items-center gap-2 mb-3">
                  <ClockIcon className="icon" />
                  <p className="label">Runtime</p>
                </div>
                <p className="value">{movie.runtime ? `${movie.runtime} min` : 'N/A'}</p>
              </div>

              {/* Rating Card */}
              <div className="metadata-card">
                <div className="flex items-center gap-2 mb-3">
                  <StarIcon className="icon" />
                  <p className="label">Rating</p>
                </div>
                <p className="value">
                  {movie.vote_average != null ? `${movie.vote_average.toFixed(1)}/10` : 'N/A'}
                </p>
              </div>

              {/* Release Card */}
              <div className="metadata-card">
                <div className="flex items-center gap-2 mb-3">
                  <CalendarIcon className="icon" />
                  <p className="label">Release</p>
                </div>
                <p className="value">
                  {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                </p>
              </div>

              {/* Budget Card */}
              <div className="metadata-card">
                <div className="flex items-center gap-2 mb-3">
                  <CurrencyDollarIcon className="icon" />
                  <p className="label">Budget</p>
                </div>
                <p className="value">
                  {movie.budget && movie.budget > 0 ? `$${(movie.budget / 1000000).toFixed(0)}M` : 'N/A'}
                </p>
              </div>
            </div>

            {/* Genres Tags */}
            <div className="mb-10">
              <div className="flex flex-wrap items-center gap-4">
                <h3 className="text-white font-bold text-2xl mr-4">Genres:</h3>
                <div className="flex flex-wrap gap-3">
                  {movie.genres?.map((genre) => (
                    <span
                      key={genre.id}
                      className="genre-tag"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Production Companies */}
        {movie.production_companies && movie.production_companies.length > 0 && (
          <div className="mt-16 mb-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Production Companies
            </h2>
            <div className="p-6 rounded-lg">
              <div className="flex flex-wrap justify-center gap-10">
                {movie.production_companies.map((company) => (
                  <div
                    key={company.id}
                    className="group flex flex-col items-center justify-center min-h-32 rounded-md p-2"
                  >
                    {company.logo_path ? (
                      <div className="relative mb-2">
                        {/* Always visible subtle white background for contrast */}
                        <div className="absolute inset-0 bg-white/10 rounded-lg -m-2"></div>
                        {/* Additional white background that appears on hover */}
                        <div className="absolute inset-0 bg-white/70 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -m-2"></div>
                        <img
                          src={`https://image.tmdb.org/t/p/w200/${company.logo_path}`}
                          className="h-12 w-auto object-contain relative z-10 transition-all duration-300 group-hover:scale-110"
                          alt={company.name}
                        />
                      </div>
                    ) : (
                      <p className="text-white text-center text-base font-bold">
                        {company.name}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Additional Movie Stats */}
        <div className="mt-12 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="stats-card">
              <h3>Popularity</h3>
              <p>{movie.popularity?.toFixed(0)}</p>
            </div>

            <div className="stats-card">
              <h3>Vote Count</h3>
              <p>{movie.vote_count?.toLocaleString()}</p>
            </div>

            <div className="stats-card">
              <h3>Status</h3>
              <span className={movie.status === 'Released' ? 'text-green-400' : 'text-yellow-400'}>
                {movie.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;