import { Eye, ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import { PriorityBadge, StatusBadge } from "./Badges";
import { formatDate } from "./formatDate";

function TicketTable({ tickets, totalCount, page, pageSize, onPageChange, onView }) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const start = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalCount);

  return (
    <div className="adv-table-card">
      <div className="adv-table-scroll">
        <table className="adv-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Customer Name</th>
              <th>Vehicle Number</th>
              <th>Vehicle Model</th>
              <th>Concern Summary</th>
              <th>Created Date</th>
              <th className="adv-col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t.id} className={t.priority === "CRITICAL" && t.status !== "RESOLVED" ? "is-critical" : ""}>
                <td className="adv-cell-id">{t.id}</td>
                <td><PriorityBadge priority={t.priority} /></td>
                <td><StatusBadge status={t.status} /></td>
                <td>{t.customerName}</td>
                <td>{t.vehicleNumber}</td>
                <td>{t.vehicleModel}</td>
                <td className="adv-cell-summary">{t.summary}</td>
                <td>{formatDate(t.createdAt)}</td>
                <td className="adv-col-actions">
                  <button className="adv-view-btn" onClick={() => onView(t.id)}>
                    <Eye size={15} /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {tickets.length === 0 && (
          <div className="adv-empty">
            <SearchX size={32} />
            <p>No tickets match your filters.</p>
          </div>
        )}
      </div>

      <div className="adv-pagination">
        <span>
          Showing {start}-{end} of {totalCount} tickets
        </span>
        <div className="adv-pagination-controls">
          <button onClick={() => onPageChange(page - 1)} disabled={page <= 1} aria-label="Previous page">
            <ChevronLeft size={16} />
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} aria-label="Next page">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TicketTable;
