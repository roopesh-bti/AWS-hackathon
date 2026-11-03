// Reusable action card: icon, title, description and a button
function DashboardCard({ icon: Icon, title, description, buttonText, onClick }) {
  return (
    <article className="sc-action-card">
      <div className="sc-action-icon">
        <Icon size={28} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      <button className="sc-action-button" onClick={onClick}>
        {buttonText}
      </button>
    </article>
  );
}

export default DashboardCard;
