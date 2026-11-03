import { formatDateTime } from "./formatDate";

function ActivityTimeline({ activity }) {
  // Newest first
  const items = [...activity].reverse();

  return (
    <ol className="adv-timeline">
      {items.map((item) => (
        <li key={item.id} className="adv-timeline-item">
          <span className="adv-timeline-dot" />
          <div>
            <span className="adv-timeline-label">{item.label}</span>
            <span className="adv-timeline-detail">{item.detail}</span>
            <span className="adv-timeline-time">{formatDateTime(item.at)}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default ActivityTimeline;
