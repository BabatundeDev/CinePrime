export function SkeletonLoader({ count = 5 }: { count?: number }): JSX.Element {
  return (
    <div className="skeleton-container">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-image"></div>
          <div className="skeleton-title"></div>
          <div className="skeleton-text"></div>
        </div>
      ))}
    </div>
  );
}
