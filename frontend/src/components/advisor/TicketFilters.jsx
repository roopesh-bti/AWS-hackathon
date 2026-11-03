import { Search, X } from "lucide-react";

export const FILTERS = [
  { key: "ALL", label: "All Tickets" },
  { key: "CRITICAL", label: "Critical" },
  { key: "OPEN", label: "Open" },
  { key: "IN_PROGRESS", label: "In Progress" },
  { key: "RESOLVED", label: "Resolved" },
];

function TicketFilters({ activeFilter, counts, onFilterChange, search, onSearchChange }) {
  return (
    <div className="adv-toolbar">
      <div className="adv-filters" role="tablist" aria-label="Ticket filters">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            role="tab"
            aria-selected={activeFilter === f.key}
            className={`adv-filter ${activeFilter === f.key ? "is-active" : ""}`}
            onClick={() => onFilterChange(f.key)}
          >
            {f.label}
            <span className="adv-filter-count">{counts[f.key]}</span>
          </button>
        ))}
      </div>

      <div className="adv-search">
        <Search size={16} />
        <input
          type="text"
          value={search}
          placeholder="Search by Ticket ID, Vehicle Number, Customer Name..."
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search tickets"
        />
        {search && (
          <button className="adv-search-clear" onClick={() => onSearchChange("")} aria-label="Clear search">
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

export default TicketFilters;
