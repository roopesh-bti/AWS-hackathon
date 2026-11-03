import { Bot, User } from "lucide-react";

// Format a Date as a short time, e.g. "10:42 AM"
function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// One chat bubble. Assistant messages sit on the left, user messages on the right.
// Optional `variant` ("critical" | "noncritical") and `label` highlight a classification result.
function ChatMessage({ role, text, time, variant, label }) {
  const isUser = role === "user";

  return (
    <div className={`rc-message ${isUser ? "rc-message-user" : "rc-message-assistant"}`}>
      <div className="rc-avatar">{isUser ? <User size={18} /> : <Bot size={18} />}</div>
      <div className="rc-bubble-wrap">
        <div
          className={`rc-bubble ${variant ? `rc-bubble-${variant}` : ""}`}
          role={variant === "critical" ? "alert" : undefined}
        >
          {label && <span className="rc-bubble-label">{label}</span>}
          {text}
        </div>
        <span className="rc-time">{formatTime(time)}</span>
      </div>
    </div>
  );
}

export default ChatMessage;
