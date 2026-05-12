import { memo } from 'react';
import { Movie } from '../types';
import { getImageUrl } from '../api/tmdb';

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

export const MovieCard = memo(function MovieCard({ movie, onClick }: MovieCardProps) {
  const rating = movie.vote_average ? (movie.vote_average / 2).toFixed(1) : '0';

  return (
    <div
      className="movie-card"
      onClick={() => onClick(movie)}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick(movie);
        }
      }}
      aria-label={`${movie.title}, ${rating} stars`}
    >
      <div className="movie-card-image">
        <img
          src={getImageUrl(movie.poster_path, 'w342')}
          alt={movie.title}
          loading="lazy"
        />
        <div className="movie-card-overlay">
          <div className="play-button">▶</div>
          <div className="rating-badge">★ {rating}</div>
        </div>
      </div>
      <div className="movie-card-content">
        <h3>{movie.title}</h3>
        <p className="release-year">{movie.release_date?.split('-')[0]}</p>
      </div>
    </div>
  );
});
