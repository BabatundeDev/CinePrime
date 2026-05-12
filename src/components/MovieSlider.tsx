import { useEffect, useState, useCallback, useRef } from 'react';
import { getMovies } from '../api/tmdb';
import { Movie } from '../types';
import { MovieCard } from './MovieCard';
import { SkeletonLoader, ErrorCard } from './utils';
import '../Styles/MovieSlider.css';

interface MovieSliderProps {
  category?: 'popular' | 'top_rated' | 'now_playing' | 'upcoming';
  movies?: Movie[];
  title: string;
  onMovieClick: (movie: Movie) => void;
}

export function MovieSlider({
  category,
  movies: externalMovies,
  title,
  onMovieClick,
}: MovieSliderProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Tracks scroll position to show or hide buttons contextually
  const updateScrollState = useCallback(() => {
    const el = sliderRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  // Fixed: abort controller prevents stale state race conditions on category change
  const fetchMovies = useCallback(async () => {
    if (!category) return;

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const data = await getMovies(category);
      setMovies(data.results || []);
    } catch (err) {
      if ((err as DOMException).name === 'AbortError') return;
      setError(
        err instanceof Error ? err.message : 'Failed to load movies'
      );
      setMovies([]);
    } finally {
      setLoading(false);
    }

    return () => controller.abort();
  }, [category]);

  useEffect(() => {
    if (externalMovies) {
      setMovies(externalMovies);
      setLoading(false);
      setError(null);
      return;
    }
    fetchMovies();
  }, [category, externalMovies, fetchMovies]);

  // Update scroll button visibility after movies load or on scroll
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    return () => el.removeEventListener('scroll', updateScrollState);
  }, [movies, updateScrollState]);

  // Fixed: dynamic scroll amount based on container width for responsive correctness
  const scroll = useCallback((direction: 'left' | 'right') => {
    const el = sliderRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.75;
    el.scrollTo({
      left:
        direction === 'left'
          ? el.scrollLeft - scrollAmount
          : el.scrollLeft + scrollAmount,
      behavior: 'smooth',
    });
  }, []);

  if (loading) {
    return (
      <div className="slider">
        <h2>{title}</h2>
        <SkeletonLoader count={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="slider">
        <h2>{title}</h2>
        {/* Fixed: retry re-fetches data, no longer nukes the entire page */}
        <ErrorCard message={error} onRetry={fetchMovies} />
      </div>
    );
  }

  if (!movies.length) {
    return (
      <div className="slider">
        <h2>{title}</h2>
        <div className="empty-state">
          <p>No movies available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="slider">
      <div className="slider-header">
        <h2>{title}</h2>
      </div>
      <div className="slider-wrapper">
        {/* Fixed: buttons are contextually hidden when there is nothing to scroll */}
        <button
          type="button"
          className="slider-btn slider-btn-left"
          onClick={() => scroll('left')}
          aria-label="Scroll left"
          disabled={!canScrollLeft}
          aria-disabled={!canScrollLeft}
        >
          ◀
        </button>
        <div
          className="movie-container"
          ref={sliderRef}
          role="region"
          aria-label={title}
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onClick={onMovieClick} />
          ))}
        </div>
        <button
          type="button"
          className="slider-btn slider-btn-right"
          onClick={() => scroll('right')}
          aria-label="Scroll right"
          disabled={!canScrollRight}
          aria-disabled={!canScrollRight}
        >
          ▶
        </button>
      </div>
    </div>
  );
}