// Reusable statistic card: icon, big number and label
function StatsCard({ icon: Icon, label, value }) {
  return (
    <div className="sc-stat-card">
      <div className="sc-stat-icon">
        <Icon size={22} />
      </div>
      <div>
        <div className="sc-stat-value">{value}</div>
        <div className="sc-stat-label">{label}</div>
      </div>
    </div>
  );
}

export default StatsCard;
