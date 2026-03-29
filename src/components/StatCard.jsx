export default function StatCard({ label, value, hint }) {
  return (
    <div className="stat-card">
      <div className="stat-card-label">{label}</div>
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-hint">{hint}</div>
    </div>
  );
}
