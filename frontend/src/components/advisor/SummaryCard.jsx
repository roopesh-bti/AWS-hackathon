function SummaryCard({ title, value, hint, icon: Icon, tone }) {
  return (
    <div className={`adv-summary-card adv-tone-${tone}`}>
      <div className="adv-summary-icon">
        <Icon size={24} />
      </div>
      <div className="adv-summary-body">
        <span className="adv-summary-title">{title}</span>
        <span className="adv-summary-value">{value}</span>
        <span className="adv-summary-hint">{hint}</span>
      </div>
    </div>
  );
}

export default SummaryCard;
