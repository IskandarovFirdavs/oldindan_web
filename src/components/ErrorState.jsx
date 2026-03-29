export default function ErrorState({ text, onRetry }) {
  return (
    <div className="error-state">
      <div>{text}</div>
      {onRetry ? <button className="secondary-button" onClick={onRetry}>Qayta urinish</button> : null}
    </div>
  );
}
