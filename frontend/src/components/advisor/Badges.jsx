export function PriorityBadge({ priority }) {
  return <span className={`adv-badge adv-priority-${priority.toLowerCase()}`}>{priority}</span>;
}

export function StatusBadge({ status }) {
  return (
    <span className={`adv-badge adv-status-${status.toLowerCase().replace(/_/g, "-")}`}>{status}</span>
  );
}
