import { useState, useCallback, useMemo, useEffect } from 'react';
import './App.css';
import { Navbar } from './components/Navbar';
import { MovieSlider } from './components/MovieSlider';
import { Footer } from './components/Footer';
import { MovieDetailsModal } from './components/MovieDetailsModal';
import { ErrorBoundary, ErrorCard } from './components/utils';
import { useFetch, useLocalStorage } from './hooks';
import { Movie, Theme } from './types';

function AppContent() {
  const [theme, setTheme] = useLocalStorage<Theme>('cineprime-theme', 'dark');

  // Fixed: searchQuery is the single source of truth; Navbar owns debounce
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useLocalStorage<Record<number, Movie>>(
    'cineprime-favorites',
    {}
  );

  // Fixed: selectedMovie alone drives modal open state, isModalOpen removed
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // Fixed: useFetch now calls the API layer, not raw hand-built URLs
  const searchUrl = searchQuery
    ? `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
      searchQuery
    )}&language=en-US&page=1`
    : null;

  const {
    data: searchData,
    loading: searchLoading,
    error: searchError,
  } = useFetch(
    searchUrl,
    {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_TOKEN}`,
      },
    },
    [searchQuery]
  );

  // Fixed: React.useEffect → useEffect from import
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  // Fixed: wrapped in useCallback to prevent unnecessary downstream re-renders
  const handleMovieClick = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  // Fixed: Navbar now owns debounce; handleSearch just syncs state
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const toggleFavorite = useCallback(
    (movie: Movie) => {
      setFavorites((prev) => {
        const next = { ...prev };
        if (next[movie.id]) {
          delete next[movie.id];
        } else {
          next[movie.id] = movie;
        }
        return next;
      });
    },
    [setFavorites]
  );

  const isFavorited = useMemo(
    () => (selectedMovie ? !!favorites[selectedMovie.id] : false),
    [selectedMovie, favorites]
  );

  // Fixed: favorites surfaced as a real UI feature
  const favoriteMovies = useMemo(() => Object.values(favorites), [favorites]);

  const searchResults = searchData?.results || [];
  const isSearching = !!searchQuery;

  return (
    <div className={`App ${theme}`}>
      <Navbar onSearch={handleSearch} theme={theme} setTheme={setTheme} />

      {isSearching ? (
        <div className="search-results-section">
          {searchError && (
            <ErrorCard
              message={searchError}
              onRetry={() => setSearchQuery(searchQuery)}
            />
          )}
          {searchLoading && (
            <div className="spinner-container">
              <div className="loading-spinner">
                <div className="spinner-circle" />
              </div>
              <p>Searching movies...</p>
            </div>
          )}
          {!searchLoading && searchResults.length > 0 && (
            <MovieSlider
              movies={searchResults}
              title={`Search Results for "${searchQuery}"`}
              onMovieClick={handleMovieClick}
            />
          )}
          {!searchLoading && searchResults.length === 0 && !searchError && (
            <div className="no-results">
              <h2>No movies found</h2>
              <p>Try searching with different keywords</p>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Fixed: favorites section now rendered when user has saved movies */}
          {favoriteMovies.length > 0 && (
            <MovieSlider
              movies={favoriteMovies}
              title="❤️ Your Favorites"
              onMovieClick={handleMovieClick}
            />
          )}
          <MovieSlider
            category="popular"
            title="🔥 Popular Now"
            onMovieClick={handleMovieClick}
          />
          <MovieSlider
            category="top_rated"
            title="⭐ Top Rated"
            onMovieClick={handleMovieClick}
          />
          <MovieSlider
            category="now_playing"
            title="🎬 Now Playing"
            onMovieClick={handleMovieClick}
          />
          <MovieSlider
            category="upcoming"
            title="🚀 Upcoming"
            onMovieClick={handleMovieClick}
          />
        </>
      )}

      <MovieDetailsModal
        movie={selectedMovie}
        isOpen={!!selectedMovie}
        onClose={handleCloseModal}
        isFavorited={isFavorited}
        onToggleFavorite={() => selectedMovie && toggleFavorite(selectedMovie)}
        onAddToWatchlist={() => selectedMovie && toggleFavorite(selectedMovie)}
      />

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}