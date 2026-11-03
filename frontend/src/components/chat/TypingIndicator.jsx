import { Bot } from "lucide-react";

// Three bouncing dots shown while the assistant is "typing"
function TypingIndicator() {
  return (
    <div className="rc-message rc-message-assistant" aria-label="Assistant is typing">
      <div className="rc-avatar">
        <Bot size={18} />
      </div>
      <div className="rc-bubble-wrap">
        <div className="rc-bubble rc-typing">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}

export default TypingIndicator;
