import { useState, useEffect, useCallback, type MouseEvent } from 'react';
import { Movie } from '../types';
import { getImageUrl } from '../api/tmdb';
import './MovieDetailsModal.css';

interface MovieDetailsModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorited: boolean;
  onToggleFavorite: () => void;
  onAddToWatchlist?: () => void;
}

export function MovieDetailsModal({
  movie,
  isOpen,
  onClose,
  isFavorited,
  onToggleFavorite,
  onAddToWatchlist,
}: MovieDetailsModalProps) {
  const [imgSrc, setImgSrc] = useState<string>('');

  // Sync image src whenever movie changes
  useEffect(() => {
    setImgSrc(getImageUrl(movie?.poster_path ?? null, 'w342'));
  }, [movie?.poster_path]);

  // Escape key closes the modal — critical accessibility requirement
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleOverlayClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  if (!isOpen || !movie) return null;

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : 'N/A';
  const rating = movie.vote_average
    ? (movie.vote_average / 2).toFixed(1)
    : 'N/A';

  return (
    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={movie.title}
    >
      <div className="modal-content">
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="modal-header">
          <img
            src={imgSrc}
            alt={movie.title}
            className="modal-poster"
            onError={() => setImgSrc('/placeholder.jpg')}
          />
          <div className="modal-info">
            <h2>{movie.title}</h2>
            <div className="movie-meta">
              <span className="release-year">{releaseYear}</span>
              <span className="divider" aria-hidden="true">•</span>
              <span className="rating">★ {rating}/5</span>
              <span className="divider" aria-hidden="true">•</span>
              <span className="votes">{movie.vote_count.toLocaleString()} votes</span>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className={`favorite-btn ${isFavorited ? 'favorited' : ''}`}
                onClick={onToggleFavorite}
                aria-pressed={isFavorited}
                aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
              >
                {isFavorited ? '♥ Favorited' : '♡ Add to Favorites'}
              </button>
              <button
                type="button"
                className="watch-btn"
                onClick={onAddToWatchlist}
                aria-label="Add to watchlist"
                disabled={!onAddToWatchlist}
              >
                + Add to Watchlist
              </button>
            </div>
          </div>
        </div>

        <div className="modal-body">
          <div className="overview-section">
            <h3>Overview</h3>
            <p>{movie.overview || 'No description available.'}</p>
          </div>

          <div className="details-grid">
            {/* Fixed: <labels> → <label> */}
            <div className="detail-item">
              <label>User Score</label>
              <p>{rating}/5</p>
            </div>
            <div className="detail-item">
              <label>Release Date</label>
              <p>{movie.release_date || 'N/A'}</p>
            </div>
            <div className="detail-item">
              <label>Vote Count</label>
              <p>{movie.vote_count.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}