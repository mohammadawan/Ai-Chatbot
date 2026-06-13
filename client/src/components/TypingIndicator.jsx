export default function TypingIndicator() {
  return (
    <div className="message-row bot-row">
      <div className="bot-dot" aria-hidden="true" />
      <div className="message-body">
        <div className="bubble bot-bubble typing-bubble" aria-label="AI is thinking">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </div>
      </div>
    </div>
  );
}
