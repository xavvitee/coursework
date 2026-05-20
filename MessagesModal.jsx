import { useState, useRef, useEffect } from "react";
import { Av } from "../ui/Atoms.jsx";

export default function MessagesModal({ task, member, messages, onClose, onSend }) {
  const [text, setText] = useState("");
  const msgs = messages[task.id] || [];
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs.length]);

  const send = () => {
    if (!text.trim()) return;
    onSend(task.id, text.trim());
    setText("");
  };

  return (
    <div className="fade" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--surface)", borderRadius: 14,
        width: 440, border: "1px solid var(--border)", boxShadow: "var(--shadow)",
        display: "flex", flexDirection: "column", maxHeight: "70vh" }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", gap: 10 }}>
          <Av m={member} size={32} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 13 }}>{member?.name}</div>
            <div style={{ fontSize: 10, color: "var(--text3)" }}>Задача: {task.title}</div>
          </div>
          <button onClick={onClose} style={{ marginLeft: "auto", border: "none",
            background: "transparent", color: "var(--text3)", fontSize: 17, cursor: "pointer" }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "14px 18px",
          display: "flex", flexDirection: "column", gap: 9, minHeight: 150 }}>
          {msgs.length === 0 && (
            <div style={{ textAlign: "center", color: "var(--text3)", fontSize: 12, paddingTop: 20 }}>
              Напиши перше повідомлення 👋
            </div>
          )}
          {msgs.map((msg, i) => (
            <div key={i} style={{
              alignSelf: msg.fromMe ? "flex-end" : "flex-start",
              background: msg.fromMe ? "var(--accent)" : "var(--surface3)",
              color: "#fff",
              borderRadius: msg.fromMe ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
              padding: "8px 13px", fontSize: 12, maxWidth: "80%",
            }}>
              <div>{msg.text}</div>
              <div style={{ fontSize: 10, opacity: 0.65, marginTop: 3 }}>{msg.time}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div style={{ padding: "11px 18px", borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}>
          <input value={text} onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Написати повідомлення..."
            style={{ flex: 1, padding: "8px 11px", borderRadius: 8,
              background: "var(--surface2)", border: "1px solid var(--border)",
              color: "var(--text)", fontSize: 12 }} />
          <button onClick={send} style={{ padding: "8px 14px", borderRadius: 8, border: "none",
            background: "var(--accent)", color: "#fff", fontSize: 13, cursor: "pointer" }}>➤</button>
        </div>
      </div>
    </div>
  );
}
