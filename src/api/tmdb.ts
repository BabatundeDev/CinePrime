import { MovieDetailsResponse, GenresResponse } from '../types';

const API_BASE = 'https://api.themoviedb.org/3';
export const IMAGE_BASE = 'https://image.tmdb.org/t/p';

// Synergy win: singleton header object, no recreation on every call
const AUTH_HEADER = {
  accept: 'application/json',
  Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_TOKEN}`,
};

// Centralized request cache for performance optimization
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// Centralized error taxonomy
class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Core fetch utility with retry logic and caching baked in
const fetchWithCache = async <T>(
  url: string,
  retries: number = 3
): Promise<T> => {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data as T;
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(url, { headers: AUTH_HEADER });

      if (!res.ok) {
        throw new ApiError(res.status, `API error: ${res.status} on ${url}`);
      }

      const data: T = await res.json();
      cache.set(url, { data, timestamp: Date.now() });
      return data;
    } catch (err) {
      lastError = err as Error;

      // Do not retry on 4xx errors — they are deterministic failures
      if (err instanceof ApiError && err.status < 500) break;

      // Exponential backoff before retry
      if (attempt < retries - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, 2 ** attempt * 300)
        );
      }
    }
  }

  throw lastError;
};

export const getMovies = async (
  category: 'popular' | 'top_rated' | 'now_playing' | 'upcoming' = 'popular',
  page: number = 1
): Promise<MovieDetailsResponse> =>
  fetchWithCache<MovieDetailsResponse>(
    `${API_BASE}/movie/${category}?language=en-US&page=${page}`
  );

export const searchMovies = async (
  query: string,
  page: number = 1
): Promise<MovieDetailsResponse> => {
  if (!query.trim()) {
    return { results: [], page, total_pages: 0, total_results: 0 };
  }
  return fetchWithCache<MovieDetailsResponse>(
    `${API_BASE}/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=${page}`
  );
};

// Fixed: now has an explicit return type
export const getMovieDetails = async (
  movieId: number
): Promise<MovieDetailsResponse> =>
  fetchWithCache<MovieDetailsResponse>(
    `${API_BASE}/movie/${movieId}?language=en-US`
  );

export const getGenres = async (): Promise<GenresResponse> =>
  fetchWithCache<GenresResponse>(
    `${API_BASE}/genre/movie/list?language=en-US`
  );

export const getTrendingMovies = async (
  page: number = 1
): Promise<MovieDetailsResponse> =>
  fetchWithCache<MovieDetailsResponse>(
    `${API_BASE}/trending/movie/week?page=${page}`
  );

export const getRecommendations = async (
  movieId: number,
  page: number = 1
): Promise<MovieDetailsResponse> =>
  fetchWithCache<MovieDetailsResponse>(
    `${API_BASE}/movie/${movieId}/recommendations?language=en-US&page=${page}`
  );

export const getImageUrl = (
  path: string | null,
  size:
    | 'w92'
    | 'w154'
    | 'w185'
    | 'w342'
    | 'w500'
    | 'w780'
    | 'original' = 'w500'
): string => {
  if (!path) return '/placeholder.jpg';
  return `${IMAGE_BASE}/${size}${path}`;
};

// Utility to manually invalidate cache when needed (e.g. after user actions)
export const clearCache = () => cache.clear();