# CinePrime

A modern, responsive movie discovery web application built with React and TypeScript. CinePrime allows users to explore trending movies, search for specific films, and manage a personal favorites list, all powered by The Movie Database (TMDB) API.

## Project Overview

CinePrime is a modern, responsive movie discovery web application built with React 19 and TypeScript. It leverages The Movie Database (TMDB) API to provide users with an intuitive interface for exploring and managing movie information. The app emphasizes performance, user experience, and accessibility.

## Key Features and Functionalities

### 1. **Movie Browsing**

- Displays movies in horizontal scrollable sliders across multiple categories:
  - Popular: Trending movies based on popularity
  - Top Rated: Highest-rated films
  - Now Playing: Currently in theaters
  - Upcoming: Soon-to-be-released movies
- Each slider loads dynamically with lazy loading and caching for optimal performance

### 2. **Search Functionality**

- Real-time search with debounced input (400ms delay) to prevent excessive API calls
- Searches TMDB's movie database by title
- Displays search results in a dedicated slider with the query as the title
- Handles empty results gracefully with user-friendly messages

### 3. **Movie Details Modal**

- Click any movie card to open a detailed modal overlay
- Displays comprehensive information:
  - High-resolution poster/backdrop images
  - Title, release year, and rating (out of 5 stars)
  - Full plot overview
  - Vote count and average rating
- Accessible with keyboard navigation (Enter/Space to open, Escape to close)
- Click outside modal or use close button to dismiss

### 4. **Favorites Management**

- Heart-shaped toggle button in the modal to add/remove movies from favorites
- Favorites are persisted in browser localStorage
- Dedicated "Your Favorites" slider appears when favorites exist
- Visual indicator shows favorited status

### 5. **Theme Toggle**

- Switch between dark and light themes
- Theme preference saved in localStorage
- Applies globally to the entire application

### 6. **User Experience Enhancements**

- **Loading States**: Skeleton loaders for movie cards, spinners for search operations
- **Error Handling**: Error boundaries catch crashes, error cards for API failures with retry options
- **Responsive Design**: Adapts to different screen sizes (mobile, tablet, desktop)
- **Accessibility**: ARIA labels, keyboard navigation, focus management
- **Performance**: API response caching (5-minute TTL), lazy image loading, optimized re-renders

### 7. **Technical Architecture**

- **API Integration**: Centralized TMDB API client with retry logic and error handling
- **State Management**: React hooks for local state, custom hooks for API calls and persistence
- **Routing**: React Router setup (though currently single-page)
- **Build System**: Vite for fast development and optimized production builds

### 8. **Additional Utilities**

- Debounced search input to reduce API load
- Local storage hooks for theme and favorites persistence
- Error boundary component for crash recovery
- Skeleton and loading spinner components for better UX

The app is designed as a flagship movie discovery tool, providing a seamless experience for users to explore, search, and curate their favorite films with modern web technologies.

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite
- **Styling**: CSS Modules
- **API**: TMDB API with Axios for HTTP requests
- **State Management**: React hooks (useState, useEffect, useCallback)
- **Utilities**: Lodash for debouncing, React Router for potential routing
- **Development**: ESLint for code quality

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- TMDB API key (sign up at [TMDB](https://www.themoviedb.org/) to get your API token)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd cineprime
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your TMDB API token:

   ```
   VITE_TMDB_API_TOKEN=your_api_token_here
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## Project Structure

```
src/
├── api/
│   └── tmdb.ts          # TMDB API integration with caching
├── components/
│   ├── MovieCard.tsx    # Individual movie card component
│   ├── MovieSlider.tsx  # Horizontal scrollable movie list
│   ├── MovieDetailsModal.tsx  # Movie details popup
│   ├── Navbar.tsx       # Navigation bar with search and theme toggle
│   ├── Footer.tsx       # Footer component
│   └── utils/           # Utility components (ErrorBoundary, LoadingSpinner, etc.)
├── hooks/
│   ├── useFetch.ts      # Custom hook for API calls
│   ├── useDebounce.ts   # Debouncing hook
│   └── useLocalStorage.ts # Local storage persistence hook
├── types/
│   └── index.ts         # TypeScript type definitions
├── Styles/              # Component-specific CSS files
└── App.tsx              # Main application component
```

## API Usage

This project uses The Movie Database (TMDB) API. You'll need to:

1. Create an account at [TMDB](https://www.themoviedb.org/)
2. Generate an API token from your account settings
3. Add the token to your `.env` file as `VITE_TMDB_API_TOKEN`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for providing the movie data API
- [Vite](https://vitejs.dev/) for the fast build tool
- [React](https://reactjs.org/) for the UI framework
