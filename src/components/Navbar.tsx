import { useState, useCallback, useRef, FormEvent, ChangeEvent } from 'react';
import { Theme } from '../types';
import '../Styles/Navbar.css';

interface NavbarProps {
  onSearch: (query: string) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  debounceMs?: number;
}

export function Navbar({ onSearch, theme, setTheme, debounceMs = 400 }: NavbarProps) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedSearch = useCallback(
    (value: string) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => onSearch(value.trim()), debounceMs);
    },
    [onSearch, debounceMs]
  );

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      if (!value) {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        onSearch('');
        return;
      }
      debouncedSearch(value);
    },
    [debouncedSearch, onSearch]
  );

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      const trimmed = query.trim();
      if (trimmed) onSearch(trimmed);
    },
    [query, onSearch]
  );

  const handleClear = useCallback(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    setQuery('');
    onSearch('');
  }, [onSearch]);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  return (
    <nav className="navbar" role="banner">
      <span className="navbar-logo">
        CinePrime
      </span>

      <form
        onSubmit={handleSubmit}
        className={`navbar-search${focused ? ' navbar-search--focused' : ''}`}
        role="search"
        aria-label="Movie search"
      >
        <span className="navbar-search-icon" aria-hidden="true">🔍</span>
        <input
          type="search"
          className="navbar-search-input"
          placeholder="Search movies and shows…"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-label="Search movies"
          autoComplete="off"
          spellCheck={false}
        />
        {query && (
          <button
            type="button"
            className="navbar-clear"
            onClick={handleClear}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </form>

      <div className="navbar-right">
        <button
          type="button"
          className="navbar-theme"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <span aria-hidden="true">{theme === 'dark' ? '☀️' : '🌙'}</span>
          <span className="navbar-theme-label">
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </span>
        </button>
      </div>
    </nav>
  );
}