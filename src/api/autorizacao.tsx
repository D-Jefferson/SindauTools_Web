import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const BASE_URL = "https://teleaulaapi-prod.renova.app.br/api";

const TokenButton: React.FC = () => {
  const [tokenFixo, setTokenFixo] = useState<string>("");
  const [salvando, setSalvando] = useState(false);
  const [editando, setEditando] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string>("");

  useEffect(() => {
    const salvo = localStorage.getItem("access_token") || "";
    (window as any).tokenGlobal = salvo;
  }, []);

const autenticar = async (tokenManual: string) => {
  try {
    const response = await fetch(`${BASE_URL}/Auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ acessToken: tokenManual }),
    });

    if (!response.ok) throw new Error(`Erro ${response.status}`);

    const tokenRecebido = await response.text();

    if (tokenRecebido && tokenRecebido.startsWith("ey")) {
      localStorage.setItem("access_token", tokenRecebido);
      (window as any).tokenGlobal = tokenRecebido;
      setStatusMsg("Autenticado com sucesso!");
      setTimeout(() => setStatusMsg(""), 3000);
      toast.success("Autenticado com sucesso!");
      console.log("[Auth] Token salvo com sucesso:", tokenRecebido);
    } else {
      throw new Error("Token inválido ou resposta inesperada.");
    }
  } catch (error) {
    toast.error("Token Inválido ou erro na autenticação.");
    console.error("Erro ao autenticar:", error);
    setStatusMsg("Falha na autenticação. Verifique o token fixo.");
    setTimeout(() => setStatusMsg(""), 4000);
  }
};

  const salvar = async () => {
    if (!tokenFixo.trim()) {
      toast.warn("Por favor, insira o token fixo.");
      return;
    }
    setSalvando(true);
    await autenticar(tokenFixo);
    setSalvando(false);
    setEditando(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1%",
        right: "0px",
        zIndex: 1000,
        backgroundColor: editando ? "rgba(0, 0, 0, 0.84)" : "transparent",
        padding: editando ? "10px 15px" : "0",
        border: editando ? "1px solid #ccc" : "none",
        borderRadius: editando ? "8px" : "0",
        fontFamily: "Arial, sans-serif",
        transition: "all 0.3s ease",
      }}
    >
      {!editando && (
        <button
          onClick={() => setEditando(true)}
          style={{
            padding: "6px 10px",
            marginRight: "8px",
            cursor: "pointer",
            backgroundColor: "rgba(135, 25, 25, 0.62)",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            transition: "background-color 0.3s ease",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          Token
        </button>
      )}

      {editando && (
        <>
          <input
            type="text"
            placeholder="Insira o token fixo"
            value={tokenFixo}
            onChange={(e) => setTokenFixo(e.target.value)}
            style={{
              padding: "6px",
              marginRight: "8px",
              width: "200px",
              borderRadius: "8px",
              border: "none",
              outline: "none",
            }}
          />
          <button
            onClick={salvar}
            disabled={salvando}
            style={{
              padding: "6px 10px",
              marginRight: "8px",
              cursor: "pointer",
              backgroundColor: "rgba(135, 25, 25, 0.62)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            {salvando ? "Autenticando..." : "Salvar"}
          </button>
          <p
            style={{
              fontSize: "12px",
              color: "rgba(233, 228, 228, 0.62)",
              marginTop: "10px",
              fontStyle: "italic",
              userSelect: "none",
            }}
          >
            Salvo no localStorage — permanece mesmo após fechar o navegador.
          </p>
          {statusMsg && (
            <p
              style={{
                color:
                  statusMsg.includes("sucesso") || statusMsg.includes("Autenticado")
                    ? "#4ade80"
                    : "#f87171",
                fontSize: "13px",
                fontWeight: "bold",
              }}
            >
              {statusMsg}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default TokenButton;
