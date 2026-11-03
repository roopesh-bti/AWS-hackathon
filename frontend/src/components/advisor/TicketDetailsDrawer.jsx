import { useEffect } from "react";
import { X, UserCheck, Play, MessageSquareMore, CircleCheck, User, Car, TriangleAlert } from "lucide-react";
import { PriorityBadge, StatusBadge } from "./Badges";
import ActivityTimeline from "./ActivityTimeline";
import { formatDateTime } from "./formatDate";

function InfoRow({ label, value }) {
  return (
    <div className="adv-info-row">
      <span className="adv-info-label">{label}</span>
      <span className="adv-info-value">{value}</span>
    </div>
  );
}

function TicketDetailsDrawer({ ticket, advisorName, onClose, onAssign, onStatusChange }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const resolved = ticket.status === "RESOLVED";
  const assignedToMe = ticket.assignedTo === advisorName;

  return (
    <>
      <div className="adv-overlay" onClick={onClose} />
      <aside className="adv-drawer" role="dialog" aria-modal="true" aria-label={`Ticket ${ticket.id}`}>
        <header className="adv-drawer-header">
          <div>
            <span className="adv-drawer-eyebrow">Ticket Details</span>
            <h2>{ticket.id}</h2>
          </div>
          <button className="adv-icon-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </header>

        <div className="adv-drawer-body">
          <section className="adv-drawer-section">
            <h3><User size={16} /> Customer Information</h3>
            <InfoRow label="Customer Name" value={ticket.customerName} />
            <InfoRow label="Email" value={ticket.email} />
            <InfoRow label="Phone" value={ticket.phone} />
          </section>

          <section className="adv-drawer-section">
            <h3><Car size={16} /> Vehicle Information</h3>
            <InfoRow label="Vehicle Number" value={ticket.vehicleNumber} />
            <InfoRow label="Vehicle Model" value={ticket.vehicleModel} />
          </section>

          <section className="adv-drawer-section">
            <h3><TriangleAlert size={16} /> Concern Information</h3>
            <InfoRow label="Ticket ID" value={ticket.id} />
            <InfoRow label="Priority" value={<PriorityBadge priority={ticket.priority} />} />
            <InfoRow label="Status" value={<StatusBadge status={ticket.status} />} />
            <InfoRow label="Assigned Advisor" value={ticket.assignedTo || "Unassigned"} />
            <InfoRow label="Created Date" value={formatDateTime(ticket.createdAt)} />
            <div className="adv-description">
              <span className="adv-info-label">Concern Description</span>
              <p>{ticket.description}</p>
            </div>
          </section>

          <section className="adv-drawer-section">
            <h3>Advisor Actions</h3>
            <div className="adv-actions">
              <button className="adv-btn adv-btn-outline" disabled={resolved || assignedToMe} onClick={onAssign}>
                <UserCheck size={16} /> Assign To Me
              </button>
              <button
                className="adv-btn adv-btn-primary"
                disabled={resolved || ticket.status === "IN_PROGRESS"}
                onClick={() => onStatusChange("IN_PROGRESS")}
              >
                <Play size={16} /> Mark In Progress
              </button>
              <button
                className="adv-btn adv-btn-outline"
                disabled={resolved || ticket.status === "WAITING_FOR_CUSTOMER"}
                onClick={() => onStatusChange("WAITING_FOR_CUSTOMER")}
              >
                <MessageSquareMore size={16} /> Request Customer Information
              </button>
              <button
                className="adv-btn adv-btn-success"
                disabled={resolved}
                onClick={() => onStatusChange("RESOLVED")}
              >
                <CircleCheck size={16} /> Mark Resolved
              </button>
            </div>
          </section>

          <section className="adv-drawer-section">
            <h3>Activity Timeline</h3>
            <ActivityTimeline activity={ticket.activity} />
          </section>
        </div>
      </aside>
    </>
  );
}

export default TicketDetailsDrawer;
