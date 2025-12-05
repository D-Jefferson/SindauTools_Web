import { useEffect, useRef, useState } from "react";
import * as monaco from "monaco-editor";
import "./cloudbeaver.css";
import cloud from "../../assets/cloud.png";

export default function CloudBeaver() {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!editorRef.current) return;

    const editor = monaco.editor.create(editorRef.current, {
      value: `Select
        uuid() AS _id,
        "CADASTRO" AS operacao,
        DATE_FORMAT(CURRENT_TIMESTAMP(), "%Y-%m-%dT%H:%i:%s-0300") AS data_hora,
        tm.uuid AS uuid_matricula,
        cfc.cnpj AS cnpj,
        "CONCLUIDO" AS situacao,
        lf.boleto_id AS numero_cobranca,
        "EFIPAY" AS operadora,
        lf.valor AS valor,
        DATE_FORMAT(lf.data_emissao, "%Y-%m-%dT%H:%i:%s-0300") AS data_criacao,
        DATE_FORMAT(coalesce(lf.data_baixa, lf.data_emissao), "%Y-%m-%dT%H:%i:%s-0300") AS data_atualizacao,
        DATE_FORMAT( lf.data_vencimento, "%Y-%m-%dT%H:%i:%s-0300") AS data_vencimento,
        lf.status_integracao AS status_atual
      FROM financeirodb.tb_lancamentos_financeiros lf
      JOIN financeirodb.tb_entidade te on te.id = lf.id_entidade
      JOIN gestaodb.tb_candidato tc on tc.cpf = te.documento
      JOIN gestaodb.tb_matricula tm on tm.id_candidato = tc.id
      JOIN gestaodb.tb_cfc cfc on cfc.id = tm.id_cfc
      WHERE tc.cpf IN (
      02720890529
      ) AND status_integracao = 'paid';`,
      language: "sql",
      theme: "vs-dark",
      fontSize: 13,
      minimap: { enabled: false },
      automaticLayout: true,
      scrollBeyondLastLine: false,
    });

    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
      () => alert("Executaria a query no backend")
    );

    return () => editor.dispose();
  }, [loading]);

  return (
    <div className="app">
      {loading ? (
        <div className="cb-loading-screen">
          <div className="cb-loading-wrapper">
            <div className="cb-loading-ring"></div>

            <div className="cb-loading-icon">
              <img src={cloud} alt="CloudBeaver Icon" />
            </div>
          </div>

          <div className="cb-loading-text">Loading...</div>
        </div>
      ) : (
        <>
          <div className="top-bar">
 <div className="left-group">
        <img src="https://cloudbeaver.sindautoba.com.br/icons/logo_sm.svg" className="icon" />

        <button className="btn">+</button>
        <button className="btn">SQL</button>
        <button className="btn">↻</button>

        <div className="divider"></div>

        <div className="dropdown">
            <i className="fa-solid fa-dolphin"></i>
            <span>Gestao-bd-SuperUser</span>
            <span className="arrow">▾</span>
        </div>

        <div className="dropdown">
            <i className="fa-solid fa-database"></i>
            <span>financeirodb</span>
            <span className="arrow">▾</span>
        </div>
    </div>

    <div className="right-group">
        <div className="user">
            <img src="https://cloudbeaver.sindautoba.com.br/icons/plugin_user_profile_m.svg" className="icon-sm" />
            <span></span>
        </div>

        <img src="https://cloudbeaver.sindautoba.com.br/icons/plugin_help_m.svg" className="icon-sm clickable" />
        <img src="https://cloudbeaver.sindautoba.com.br/icons/plugin_settings_menu_m.svg" className="icon-sm clickable" />
    </div>
          </div>

          <div className="main">
            <aside className="sidebar">
              <div className="sidebar-header">Shared</div>
              <div className="tree">
                <div className="tree-item">
                  <span className="tree-arrow">▾</span>
                  <span className="tree-icon">🗄</span>
                  <span className="tree-label">
                    SIMULAÇÃO
                  </span>
                </div>
              </div>
            </aside>

            <section className="workspace">
              <div className="file-tabs">
                <div className="file-tab active">
                  <div className="file-tab-icon"></div>
                    Notificação financeira
                  <div className="file-tab-dot"></div>
                </div>
              </div>

              <div className="editor-wrapper">
                <div id="editor" ref={editorRef}></div>
                <div className="status-bar">
                  Execute query with Ctrl+Enter
                </div>
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
