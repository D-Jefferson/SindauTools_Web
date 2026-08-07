import React, { useState, useEffect } from "react";

interface ModalNotificarRenovaProps {
  aberto: boolean;
  onFechar: () => void;
  payloadInicial: any;
  onEnviar: (payload: any) => Promise<void>;
  loading: boolean;
  erro: string | null;
  sucesso: boolean;
  temToken: boolean;
  onAbrirConfigToken?: () => void;
}

export const ModalNotificarRenova: React.FC<ModalNotificarRenovaProps> = ({
  aberto,
  onFechar,
  payloadInicial,
  onEnviar,
  loading,
  erro,
  sucesso,
  temToken,
  onAbrirConfigToken,
}) => {
  const [jsonText, setJsonText] = useState("");
  const [erroSintaxe, setErroSintaxe] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (aberto && payloadInicial) {
      const formatted = JSON.stringify(payloadInicial, null, 2);
      setJsonText(formatted);
      setErroSintaxe(null);
      setCopiado(false);
    }
  }, [aberto, payloadInicial]);

  if (!aberto) return null;

  const handleJsonChange = (val: string) => {
    setJsonText(val);
    try {
      JSON.parse(val);
      setErroSintaxe(null);
    } catch (e: any) {
      setErroSintaxe(e.message || "Sintaxe JSON inválida");
    }
  };

  const handleFormatar = () => {
    try {
      const parsed = JSON.parse(jsonText);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonText(formatted);
      setErroSintaxe(null);
    } catch (e: any) {
      setErroSintaxe("Não foi possível formatar: " + (e.message || "JSON inválido"));
    }
  };

  const handleRestaurar = () => {
    if (payloadInicial) {
      setJsonText(JSON.stringify(payloadInicial, null, 2));
      setErroSintaxe(null);
    }
  };

  const handleCopiar = async () => {
    try {
      await navigator.clipboard.writeText(jsonText);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleConfirmarEnvio = () => {
    try {
      const parsed = JSON.parse(jsonText);
      onEnviar(parsed);
    } catch (e: any) {
      setErroSintaxe("Corrija os erros do JSON antes de enviar.");
    }
  };

  return (
    <div className="ds-modal-overlay" onClick={onFechar}>
      <div className="ds-modal ds-modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="ds-modal-header">
          <h3>
            <i className="fas fa-paper-plane" /> Notificar Renova (Teleaula)
          </h3>
          <button className="ds-modal-close" onClick={onFechar} title="Fechar">
            <i className="fas fa-times" />
          </button>
        </div>

        <p className="ds-modal-subtitle">
          Revise e personalize o payload JSON antes de enviar para a API da Teleaula.
        </p>

        {!temToken && (
          <div className="ds-modal-warning">
            <i className="fas fa-exclamation-triangle" />
            <span>
              Token TeleaulaAPI não configurado.{" "}
              {onAbrirConfigToken && (
                <button
                  type="button"
                  className="ds-link-action"
                  onClick={() => {
                    onFechar();
                    onAbrirConfigToken();
                  }}
                >
                  Configurar token agora
                </button>
              )}
            </span>
          </div>
        )}

        <div className="ds-json-toolbar">
          <div className="ds-json-status">
            {erroSintaxe ? (
              <span className="ds-json-badge error">
                <i className="fas fa-times-circle" /> {erroSintaxe}
              </span>
            ) : (
              <span className="ds-json-badge success">
                <i className="fas fa-check-circle" /> JSON Válido
              </span>
            )}
          </div>
          <div className="ds-json-actions">
            <button
              type="button"
              className="ds-btn-mini"
              onClick={handleFormatar}
              title="Formatar indentação do JSON"
            >
              <i className="fas fa-magic" /> Formatar
            </button>
            <button
              type="button"
              className="ds-btn-mini"
              onClick={handleRestaurar}
              title="Restaurar valores iniciais"
            >
              <i className="fas fa-undo" /> Restaurar
            </button>
            <button
              type="button"
              className="ds-btn-mini"
              onClick={handleCopiar}
              title="Copiar JSON"
            >
              <i className={`fas ${copiado ? "fa-check" : "fa-copy"}`} />{" "}
              {copiado ? "Copiado!" : "Copiar"}
            </button>
          </div>
        </div>

        <div className="ds-json-editor-container">
          <textarea
            className={`ds-json-editor ${erroSintaxe ? "has-error" : ""}`}
            value={jsonText}
            onChange={(e) => handleJsonChange(e.target.value)}
            rows={14}
            spellCheck={false}
            disabled={loading}
          />
        </div>

        {sucesso && (
          <div className="ds-feedback success">
            <i className="fas fa-check-circle" /> Notificação enviada com sucesso!
          </div>
        )}

        {erro && (
          <div className="ds-feedback error">
            <i className="fas fa-exclamation-circle" /> {erro}
          </div>
        )}

        <div className="ds-modal-actions">
          <button className="ds-btn" onClick={onFechar} disabled={loading}>
            Fechar
          </button>
          <button
            className="ds-btn primary"
            onClick={handleConfirmarEnvio}
            disabled={loading || !!erroSintaxe || !jsonText.trim()}
          >
            {loading ? (
              <>
                <i className="fas fa-circle-notch fa-spin" /> Enviando...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane" /> Enviar Notificação
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
