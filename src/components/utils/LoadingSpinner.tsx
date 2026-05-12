import './LoadingSpinner.css';

export function LoadingSpinner(): JSX.Element {
  return (
    <div className="spinner-container">
      <div className="loading-spinner">
        <div className="spinner-circle"></div>
      </div>
      <p>Loading...</p>
    </div>
  );
}
