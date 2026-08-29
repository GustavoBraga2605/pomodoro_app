import React, { useState } from "react";

function TomatoMark({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 6c-1-1.6-2.6-2.4-4.2-2 .4 1.4 1.4 2.2 2.6 2.4"
        stroke="#F4EFE4"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M12 6c1-1.6 2.6-2.4 4.2-2-.4 1.4-1.4 2.2-2.6 2.4"
        stroke="#F4EFE4"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="12" cy="14" r="7.2" fill="#E8492E" stroke="#E8492E" strokeWidth="1.4" />
    </svg>
  );
}

function EyeIcon({ open }) {
  return open ? (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path
        d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ) : (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 3l18 18M10.6 10.7a3 3 0 004.2 4.2M6.6 6.7C4 8.4 2 12 2 12s4 7 11 7c1.9 0 3.5-.5 4.9-1.2M17.4 17.3C19.7 15.7 22 12 22 12s-1.6-2.9-4.4-4.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

const RULES = [
  { key: "len", label: "Mínimo de 8 caracteres", test: (p) => p.length >= 8 },
  { key: "num", label: "Pelo menos 1 número", test: (p) => /\d/.test(p) },
  { key: "case", label: "Maiúscula e minúscula", test: (p) => /[a-z]/.test(p) && /[A-Z]/.test(p) },
];

export default function CadastroScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const rulesPassed = RULES.every((r) => r.test(password));
  const passwordsMatch = confirm.length > 0 && password === confirm;
  const formValid =
    name.trim().length > 1 && emailValid && rulesPassed && passwordsMatch && accepted;

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (formValid) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={styles.page}>
        <FontImport />
        <div style={{ ...styles.card, textAlign: "center", gap: 20 }}>
          <div style={styles.successMark}>
            <TomatoMark size={30} />
          </div>
          <h1 style={styles.title}>Conta plantada!</h1>
          <p style={styles.subtitle}>
            Enviamos um e-mail de confirmação para <strong style={{ color: "#F4EFE4" }}>{email}</strong>.
            Confirme para começar a colher seus primeiros pomodoros.
          </p>
          <button
            style={styles.primaryBtn}
            onClick={() => {
              setSubmitted(false);
              setName("");
              setEmail("");
              setPassword("");
              setConfirm("");
              setAccepted(false);
              setTouched(false);
            }}
          >
            Voltar ao cadastro
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <FontImport />
      <div style={styles.card}>
        <div style={styles.wordmark}>
          <TomatoMark size={22} />
          <span style={styles.wordmarkText}>maduro.</span>
        </div>

        <div style={{ marginBottom: 4 }}>
          <h1 style={styles.title}>Plante sua conta</h1>
          <p style={styles.subtitle}>
            Cada pomodoro começa com uma semente. Crie sua conta para colher os primeiros hoje.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form} noValidate>
          <Field label="Nome">
            <input
              style={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Como podemos te chamar?"
              autoComplete="name"
            />
          </Field>

          <Field
            label="E-mail"
            error={touched && email.length > 0 && !emailValid ? "E-mail inválido" : null}
          >
            <input
              type="email"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@exemplo.com"
              autoComplete="email"
            />
          </Field>

          <Field label="Senha">
            <div style={styles.inputWithIcon}>
              <input
                type={showPw ? "text" : "password"}
                style={{ ...styles.input, paddingRight: 40, border: "none" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Crie uma senha"
                autoComplete="new-password"
              />
              <button
                type="button"
                style={styles.eyeBtn}
                onClick={() => setShowPw((s) => !s)}
                aria-label={showPw ? "Ocultar senha" : "Mostrar senha"}
              >
                <EyeIcon open={showPw} />
              </button>
            </div>
            {password.length > 0 && (
              <ul style={styles.ruleList}>
                {RULES.map((r) => {
                  const ok = r.test(password);
                  return (
                    <li
                      key={r.key}
                      style={{
                        ...styles.ruleItem,
                        color: ok ? "#8FB37D" : "rgba(244,239,228,0.4)",
                      }}
                    >
                      <span style={styles.ruleDot(ok)} />
                      {r.label}
                    </li>
                  );
                })}
              </ul>
            )}
          </Field>

          <Field
            label="Confirmar senha"
            error={
              touched && confirm.length > 0 && !passwordsMatch ? "As senhas não coincidem" : null
            }
          >
            <div style={styles.inputWithIcon}>
              <input
                type={showConfirm ? "text" : "password"}
                style={{ ...styles.input, paddingRight: 40, border: "none" }}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repita a senha"
                autoComplete="new-password"
              />
              <button
                type="button"
                style={styles.eyeBtn}
                onClick={() => setShowConfirm((s) => !s)}
                aria-label={showConfirm ? "Ocultar senha" : "Mostrar senha"}
              >
                <EyeIcon open={showConfirm} />
              </button>
            </div>
          </Field>

          <label style={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              style={styles.checkbox}
            />
            <span style={styles.checkboxLabel}>
              Aceito os <a style={styles.link}>termos de uso</a> e a{" "}
              <a style={styles.link}>política de privacidade</a>
            </span>
          </label>

          {touched && !formValid && (
            <p style={styles.formError}>Revise os campos destacados antes de continuar.</p>
          )}

          <button type="submit" style={styles.primaryBtn}>
            Criar minha conta
          </button>
        </form>

        <p style={styles.footerText}>
          Já tem uma conta? <a style={styles.link}>Entrar</a>
        </p>
      </div>
    </div>
  );
}

function Field({ label, children, error }) {
  return (
    <div style={styles.field}>
      <label style={styles.fieldLabel}>{label}</label>
      {children}
      {error && <span style={styles.fieldError}>{error}</span>}
    </div>
  );
}

function FontImport() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');
      * { box-sizing: border-box; }
      input { font-family: 'IBM Plex Sans', sans-serif; }
      input::placeholder { color: rgba(244,239,228,0.32); }
      input:focus { outline: none; }
      button { font-family: inherit; }
      a { cursor: pointer; }
    `}</style>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#1B2420",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px 16px",
    fontFamily: "'IBM Plex Sans', sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    display: "flex",
    flexDirection: "column",
    gap: 22,
  },
  wordmark: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  wordmarkText: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 15,
    fontWeight: 600,
    letterSpacing: "0.02em",
    color: "#F4EFE4",
    opacity: 0.85,
  },
  title: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 26,
    fontWeight: 600,
    color: "#F4EFE4",
    margin: "0 0 6px 0",
  },
  subtitle: {
    fontSize: 13.5,
    lineHeight: 1.5,
    color: "rgba(244,239,228,0.55)",
    margin: 0,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  fieldLabel: {
    fontSize: 11.5,
    fontWeight: 500,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    color: "rgba(244,239,228,0.45)",
  },
  input: {
    width: "100%",
    background: "rgba(244,239,228,0.05)",
    border: "1px solid rgba(244,239,228,0.14)",
    borderRadius: 10,
    padding: "12px 14px",
    fontSize: 14,
    color: "#F4EFE4",
  },
  inputWithIcon: {
    display: "flex",
    alignItems: "center",
    position: "relative",
    background: "rgba(244,239,228,0.05)",
    border: "1px solid rgba(244,239,228,0.14)",
    borderRadius: 10,
  },
  eyeBtn: {
    position: "absolute",
    right: 10,
    background: "transparent",
    border: "none",
    color: "rgba(244,239,228,0.4)",
    display: "flex",
    padding: 4,
  },
  ruleList: {
    listStyle: "none",
    margin: "4px 0 0 0",
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  ruleItem: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    fontSize: 11.5,
  },
  ruleDot: (ok) => ({
    width: 5,
    height: 5,
    borderRadius: "50%",
    background: ok ? "#8FB37D" : "rgba(244,239,228,0.3)",
    display: "inline-block",
  }),
  fieldError: {
    fontSize: 11.5,
    color: "#E8492E",
  },
  checkboxRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    cursor: "pointer",
  },
  checkbox: {
    marginTop: 2,
    width: 15,
    height: 15,
    accentColor: "#E8492E",
    flexShrink: 0,
  },
  checkboxLabel: {
    fontSize: 12.5,
    lineHeight: 1.5,
    color: "rgba(244,239,228,0.6)",
  },
  link: {
    color: "#E8492E",
    textDecoration: "underline",
    textUnderlineOffset: 2,
  },
  formError: {
    fontSize: 12,
    color: "#E8492E",
    margin: 0,
  },
  primaryBtn: {
    border: "none",
    background: "#E8492E",
    color: "#1B2420",
    borderRadius: 999,
    padding: "13px 20px",
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: "0.01em",
    boxShadow: "0 8px 20px -8px rgba(232,73,46,0.5)",
    marginTop: 4,
  },
  footerText: {
    textAlign: "center",
    fontSize: 12.5,
    color: "rgba(244,239,228,0.5)",
  },
  successMark: {
    width: 60,
    height: 60,
    borderRadius: "50%",
    background: "rgba(232,73,46,0.12)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
  },
};
