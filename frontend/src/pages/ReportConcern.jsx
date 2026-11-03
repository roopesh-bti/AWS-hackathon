import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";
import Logo from "../components/Logo";
import ChatMessage from "../components/chat/ChatMessage";
import TypingIndicator from "../components/chat/TypingIndicator";
import ChatInput from "../components/chat/ChatInput";
import { classifyConcern } from "../services/classifierApi";
import "../styles/ReportConcern.css";

// Mock conversation that is shown when the page opens
const initialMessages = [
  {
    id: 1,
    role: "assistant",
    text: "Hello! I'm your BMW ServiceCare Assistant. Please describe your vehicle concern.",
    time: new Date(),
  },
];

const CRITICAL_REPLY = {
  variant: "critical",
  label: "Critical",
  text: "Your concern has been classified as CRITICAL. Advisor attention is required.",
};

const NON_CRITICAL_REPLY = {
  variant: "noncritical",
  label: "Non-critical",
  text: "Your concern has been classified as non-critical.",
};

// Friendly text for each classifier failure; details are not shown to customers
const ERROR_REPLIES = {
  timeout: "The request is taking too long. Please try again in a moment.",
  network: "We couldn't reach the service. Please check your connection and try again.",
  http: "The service returned an error. Please try again in a moment.",
  invalid: "We received an unexpected response. Please try again in a moment.",
};
const DEFAULT_ERROR_REPLY = "Sorry, we couldn't process your concern just now. Please try again.";

function ReportConcern() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const bottomRef = useRef(null);
  const nextId = useRef(2);
  const isMounted = useRef(true);
  const isSending = useRef(false); // ref so a fast double Enter cannot slip past the state check

  // Scroll to the newest message whenever the conversation changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Avoid state updates if the user leaves while a reply is pending
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  function addMessage(message) {
    setMessages((prev) => [...prev, { id: nextId.current++, time: new Date(), ...message }]);
  }

  // Add the user's message, classify it, then show the result as an assistant message
  async function handleSend() {
    const text = input.trim();
    if (!text || isSending.current) return;

    isSending.current = true;
    addMessage({ role: "user", text });
    setInput("");
    setIsTyping(true);

    try {
      const result = await classifyConcern(text);
      if (isMounted.current) {
        // The API's own reply text (it includes the ticket ID) is shown for critical concerns
        addMessage({
          role: "assistant",
          ...(result.type === "critical"
            ? { ...CRITICAL_REPLY, text: result.reply || CRITICAL_REPLY.text }
            : NON_CRITICAL_REPLY),
        });
      }
    } catch (err) {
      if (isMounted.current) {
        addMessage({ role: "assistant", text: ERROR_REPLIES[err.kind] || DEFAULT_ERROR_REPLY });
      }
    } finally {
      isSending.current = false;
      if (isMounted.current) setIsTyping(false);
    }
  }

  return (
    <div className="rc-page">
      {/* Top navigation */}
      <header className="rc-header">
        <div className="rc-header-left">
          <Logo light />
          <span className="rc-header-divider" />
          <h1 className="rc-header-title">Report Vehicle Concern</h1>
        </div>

        <div className="rc-header-right">
          <button className="rc-back" onClick={() => navigate("/dashboard")}>
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </button>
          <span className="rc-profile" aria-label="User profile">
            <User size={18} />
          </span>
        </div>
      </header>

      {/* Chat card */}
      <main className="rc-main">
        <section className="rc-chat">
          <div className="rc-messages">
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                role={msg.role}
                text={msg.text}
                time={msg.time}
                variant={msg.variant}
                label={msg.label}
              />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>

          <ChatInput value={input} onChange={setInput} onSend={handleSend} disabled={isTyping} />
        </section>
      </main>
    </div>
  );
}

export default ReportConcern;
