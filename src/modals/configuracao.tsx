import React, { useState, useEffect } from "react";
import { autenticarTeleaula } from "../api/Teleaula/autenticacao";
import { useTeleaulaToken } from "../scripts/teleaulatoken";

interface Props {
  aberto: boolean;
  onFechar: () => void;
}

type EstadoAuth = "idle" | "loading" | "success" | "error";

export const ModalConfiguracoes: React.FC<Props> = ({ aberto, onFechar }) => {
  const { token, salvar } = useTeleaulaToken();
  const [input, setInput] = useState(token || "");
  const [estadoAuth, setEstadoAuth] = useState<EstadoAuth>("idle");
  const [erroAuth, setErroAuth] = useState<string | null>(null);
  useEffect(() => {
    setInput(token || "");
  }, [token]);

  if (!aberto) return null;

const handleAutenticar = async () => {
    if (!input.trim()) return;
    setEstadoAuth("loading");
    setErroAuth(null);
    try {
      const resposta = await autenticarTeleaula(input.trim());
      console.log("Resposta da API:", resposta);

      salvar(input.trim());
      setEstadoAuth("success");
    } catch (error) {
      console.error("Erro capturado na autenticação:", error);

      setErroAuth("Token inválido ou falha na autenticação.");
      setEstadoAuth("error");
    }
  };

  return (
    <div className="ds-modal-overlay" onClick={onFechar}>
      <div className="ds-modal" onClick={(e) => e.stopPropagation()}>
        <h3>
          <i className="fas fa-cog" /> Configurações
        </h3>
        <p>
          Token de acesso da TeleaulaAPI. Autentique diariamente para manter a
          sessão ativa.
        </p>

        <input
          type="text"
          className="ds-input"
          placeholder="Cole o token aqui"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setEstadoAuth("idle");
          }}
        />

        {estadoAuth === "success" && (
          <p className="ds-feedback success">
            <i className="fas fa-check-circle" /> Token autenticado e salvo.
          </p>
        )}
        {estadoAuth === "error" && (
          <p className="ds-feedback error">
            <i className="fas fa-times-circle" /> {erroAuth}
          </p>
        )}

        <div className="ds-modal-actions">
          <button className="ds-btn" onClick={onFechar}>
            Fechar
          </button>
          <button
            className="ds-btn primary"
            onClick={handleAutenticar}
            disabled={!input.trim() || estadoAuth === "loading"}
          >
            {estadoAuth === "loading" ? (
              <>
                <i className="fas fa-circle-notch fa-spin" /> Autenticando...
              </>
            ) : (
              <>
                <i className="fas fa-key" /> Autenticar e Salvar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};