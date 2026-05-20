import { useState } from "react";
import { ROLES } from "../../utils/constants.js";

export default function InviteModal({ members, onClose, onInvite }) {
  const [email, setEmail] = useState("");
  const [role,  setRole]  = useState("Розробник");
  const [sent,  setSent]  = useState("");
  const [err,   setErr]   = useState("");

  const handle = () => {
    try {
      onInvite(email, role); // кидає помилку якщо некоректно
      setSent(email);
      setEmail("");
      setErr("");
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div className="fade" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--surface)", borderRadius: 14,
        width: 400, border: "1px solid var(--border)", boxShadow: "var(--shadow)", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 800, fontSize: 15 }}>✉ Запросити до команди</span>
          <button onClick={onClose} style={{ border: "none", background: "transparent", color: "var(--text3)", fontSize: 17, cursor: "pointer" }}>✕</button>
        </div>
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 13 }}>
          {sent && (
            <div style={{ background: "#22c55e18", border: "1px solid #22c55e44", borderRadius: 8,
              padding: "10px 13px", fontSize: 12, color: "var(--green)" }}>
              ✓ Запрошення надіслано на <b>{sent}</b> — учасника додано до команди!
            </div>
          )}
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text2)", display: "block", marginBottom: 5 }}>Email адреса</label>
            <input value={email} onChange={(e) => { setEmail(e.target.value); setErr(""); }}
              placeholder="name@example.com" type="email"
              onKeyDown={(e) => e.key === "Enter" && handle()}
              style={{ width: "100%", padding: "9px 11px", borderRadius: 8,
                background: "var(--surface2)", border: `1px solid ${err ? "var(--red)" : "var(--border)"}`,
                color: "var(--text)", fontSize: 13 }} />
            {err && <div style={{ fontSize: 11, color: "var(--red)", marginTop: 4 }}>{err}</div>}
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text2)", display: "block", marginBottom: 5 }}>Роль в команді</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}
              style={{ width: "100%", padding: "9px 11px", borderRadius: 8,
                background: "var(--surface2)", border: "1px solid var(--border)",
                color: "var(--text)", fontSize: 13 }}>
              {ROLES.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
          <button onClick={handle} style={{ padding: "10px", borderRadius: 8, border: "none",
            background: "var(--accent)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            Надіслати запрошення
          </button>
          <div style={{ fontSize: 11, color: "var(--text3)", textAlign: "center", lineHeight: 1.5 }}>
            Для реальних листів — підключіть Supabase або Nodemailer.<br/>
            Інструкція у файлі <code style={{ color: "var(--accent)" }}>src/storage/schema.sql</code>
          </div>
        </div>
      </div>
    </div>
  );
}
