import React, { useState } from "react";

export default function Manutencao() {
  const [mostrarInfo, setMostrarInfo] = useState(false);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.icon}>🛠️</div>
        <h1 style={styles.title}>Estamos em manutenção</h1>
        <p style={styles.text}>
          Estamos realizando atualizações para melhorar sua experiência.<br />
          Por favor, aguarde... Para mais detalhes clique{" "}
          <span
            onClick={() => setMostrarInfo(true)}
            style={{ color: "#facc15", textDecoration: "underline", cursor: "pointer" }}
          >
            aqui
          </span>.
        </p>

        <div style={styles.loader}></div>
        <p style={styles.footer}>© {new Date().getFullYear()} By Jefferson</p>
      </div>

      {/* Modal informativo */}
      {mostrarInfo && (
        <div style={styles.modalOverlay} onClick={() => setMostrarInfo(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Atualizações em andamento</h2>
            <ul style={styles.lista}>
              <li>🔧 Migração de sistema para React + TypeScript + Vite</li>
              <li>🖥️ Melhorando a interface para dispositivos móveis</li>
              <li>🔒 Implementando melhorias de segurança e API</li>
              <li>🕓 Tempo estimado de retorno: até 72h</li>
            </ul>
            <button style={styles.botaoFechar} onClick={() => setMostrarInfo(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    width: "100vw",
    background: "linear-gradient(135deg, #141414, #2c2c2c)",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Segoe UI', Roboto, sans-serif",
  },
  card: {
    textAlign: "center",
    padding: "50px 40px",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: "20px",
    boxShadow: "0 0 20px rgba(0,0,0,0.4)",
    maxWidth: "500px",
    width: "90%",
    animation: "fadeIn 1s ease-in-out",
  },
  icon: { fontSize: "70px", marginBottom: "20px" },
  title: { fontSize: "28px", marginBottom: "10px", letterSpacing: "0.5px" },
  text: { fontSize: "16px", lineHeight: "1.6", color: "#d1d1d1", marginBottom: "30px" },
  loader: {
    width: "50px",
    height: "50px",
    border: "4px solid rgba(255,255,255,0.2)",
    borderTopColor: "#facc15",
    borderRadius: "50%",
    margin: "0 auto 25px",
    animation: "spin 1s linear infinite",
  },
  footer: { fontSize: "13px", color: "#888", marginTop: "10px" },
  // Modal
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#1e1e1e",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 0 20px rgba(0,0,0,0.5)",
    width: "90%",
    maxWidth: "450px",
    textAlign: "left",
    animation: "fadeIn 0.3s ease-in-out",
  },
  modalTitle: {
    color: "#facc15",
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "15px",
    textAlign: "center",
  },
  lista: {
    listStyle: "none",
    paddingLeft: "0",
    color: "#ccc",
    lineHeight: "1.8",
    marginBottom: "20px",
  },
  botaoFechar: {
    backgroundColor: "#facc15",
    color: "#000",
    border: "none",
    borderRadius: "8px",
    padding: "8px 20px",
    cursor: "pointer",
    fontWeight: "600",
    display: "block",
    margin: "0 auto",
  },
};

// animações CSS
const styleTag = document.createElement("style");
styleTag.innerHTML = `
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}`;
document.head.appendChild(styleTag);
