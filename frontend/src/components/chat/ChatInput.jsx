import { useRef, useEffect } from "react";
import { Paperclip, Mic, SendHorizontal } from "lucide-react";

// Message box with attachment / microphone placeholders and a send button
function ChatInput({ value, onChange, onSend, disabled }) {
  const textareaRef = useRef(null);

  // Shrink back to one line once the message has been sent
  useEffect(() => {
    if (!value) textareaRef.current.style.height = "auto";
  }, [value]);

  // Grow the textarea with its content (up to the CSS max-height)
  function handleChange(e) {
    onChange(e.target.value);
    const el = textareaRef.current;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }

  // Enter sends, Shift+Enter adds a new line
  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div className="rc-input-bar">
      <div className="rc-input-box">
        <button type="button" className="rc-icon-btn" title="Attach file (coming soon)" aria-label="Attach file">
          <Paperclip size={20} />
        </button>

        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          placeholder="Describe your vehicle issue..."
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />

        <button type="button" className="rc-icon-btn" title="Voice input (coming soon)" aria-label="Voice input">
          <Mic size={20} />
        </button>

        <button
          type="button"
          className="rc-send-btn"
          onClick={onSend}
          disabled={!canSend}
          aria-label="Send message"
        >
          <SendHorizontal size={18} />
        </button>
      </div>
      <p className="rc-hint">Press Enter to send, Shift+Enter for a new line.</p>
    </div>
  );
}

export default ChatInput;
