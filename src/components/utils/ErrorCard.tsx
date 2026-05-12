import './ErrorCard.css';

interface ErrorCardProps {
  message: string;
  onRetry: () => void;
  title?: string;
  className?: string;
  retryLabel?: string;
}

export function ErrorCard({
  message,
  onRetry,
  title = 'Failed to Load',
  className = '',
  retryLabel = 'Try Again',
}: ErrorCardProps) {
  return (
    <div
      className={`error-card ${className}`.trim()}
      role="alert"
      aria-live="assertive"
    >
      <div className="error-icon" aria-hidden="true">
        ⚠️
      </div>
      <h3>{title}</h3>
      <p>{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="error-retry-btn"
        aria-label={retryLabel}
      >
        {retryLabel}
      </button>
    </div>
  );
}