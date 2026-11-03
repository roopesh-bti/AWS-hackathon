import { Siren, ChevronRight } from "lucide-react";

function CriticalAlertPanel({ tickets, onSelect }) {
  if (tickets.length === 0) return null;

  return (
    <section className="adv-alert" role="alert">
      <div className="adv-alert-header">
        <Siren size={22} />
        <h2>Critical Concerns Requiring Immediate Attention</h2>
        <span className="adv-alert-count">{tickets.length}</span>
      </div>
      <div className="adv-alert-list">
        {tickets.map((t) => (
          <button key={t.id} className="adv-alert-item" onClick={() => onSelect(t.id)}>
            <div>
              <span className="adv-alert-id">{t.id}</span>
              <span className="adv-alert-summary">{t.summary}</span>
              <span className="adv-alert-vehicle">
                {t.vehicleModel} &middot; {t.vehicleNumber}
              </span>
            </div>
            <ChevronRight size={18} />
          </button>
        ))}
      </div>
    </section>
  );
}

export default CriticalAlertPanel;
