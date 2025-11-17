import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./formatadores.module.css";
import { toast } from "react-toastify";
import { copiarTexto } from "../../utils/clipboard";


import { useNotificacao } from "../../scripts/notificacao";
import { useMatricula } from "../../scripts/matricula";
import { useVincular } from "../../scripts/vincular";
import { useDesvincular } from "../../scripts/desvincular";
import { getToken } from "../../utils/tokenManager";

const Formatadores2: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as
    | { abaInicial?: "notificacao" | "vincular" | "desvincular" | "matricula" }
    | undefined;

  const [abaAtiva, setAbaAtiva] = useState<
    "notificacao" | "vincular" | "desvincular" | "matricula"
  >(state?.abaInicial || "notificacao");

  const [texto, setTexto] = useState("");
  const [cpf, setCpf] = useState("");

  const notificacao = useNotificacao();
  const matricula = useMatricula();
  const vincular = useVincular();
  const desvincular = useDesvincular();

  const limparResultados = (secao: string) => {
    setTexto("");
    setCpf("");
    if (secao === "notificacao") notificacao.limpar();
    if (secao === "matricula") matricula.limpar();
    if (secao === "vincular") vincular.limpar();
    if (secao === "desvincular") desvincular.limpar();
  };
  const [copiadoIndex, setCopiadoIndex] = useState<number | null>(null);

  const handleCopiar = async (dados: any, index: number) => {
    const texto = JSON.stringify(dados, null, 2);
    await copiarTexto(texto);
    toast.success("Copiado para a área de transferência!");
    setCopiadoIndex(index);
  };

  const handleEnviar = async (item: any) => {
    try {
      const token = getToken();
      await notificacao.enviar(item, token);
      toast.success("Enviado com sucesso!");
    } catch (err) {
      toast.error("Erro ao enviar!");
      console.error(err);
    }
  };

  return (
    <div className={styles["page-container"]}>
      {/* MENU LATERAL */}
      <aside className={styles["menu-lateral-inicio"]}>
        <div className={styles["menu-lateral-logo"]}>
          <h1>
            SINDAU<span>TOOLS</span>
          </h1>
        </div>

        <div className={styles["perfil"]}>
          <div className={styles["perfil-icone"]}>S</div>
          <div className={styles["perfil-info"]}>
            <div className={styles["perfil-nome"]}>Suporte</div>
            <div className={styles["perfil-tipo"]}>Administrador</div>
          </div>
        </div>

        <nav className="lateral-nav">
          <a onClick={() => navigate("/demo/home")} >
            <i className="fas fa-home"></i>
            <span>Início</span>
          </a>

          <a onClick={() => navigate("/demo/ferramentas")} className="active">
            <i className="fas fa-tools"></i>
            <span>Ferramentas</span>
          </a>

          <a onClick={() => navigate("/demo/sobre")}>
            <i className="fas fa-book"></i>
            <span>Sobre</span>
          </a>

          <a onClick={() => navigate("/demo/filtrocpf")}>
            <i className="fa-solid fa-filter"></i>
            <span>Filtro CPF</span>
          </a>

          <a onClick={() => navigate("/demo/ajuda")}>
            <i className="fas fa-info-circle"></i>
            <span>Ajuda</span>
          </a>
        </nav>

        <div
          className={styles["assina"]}
          style={{ backgroundColor: "transparent" }}
        >
          <p style={{ color: "#b8b8b8" }}>@By Jefferson Levy</p>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className={styles["container"]}>
        {/* Botões de navegação entre os formatadores */}
        <div className={styles["nav-menus"]}>
          <button
            className={`${styles["nav-menu"]} ${
              abaAtiva === "notificacao" ? styles["active"] : ""
            }`}
            onClick={() => setAbaAtiva("notificacao")}
          >
            Notificação Financeira
          </button>
          <button
            className={`${styles["nav-menu"]} ${
              abaAtiva === "vincular" ? styles["active"] : ""
            }`}
            onClick={() => setAbaAtiva("vincular")}
          >
            Vincular Candidato
          </button>
          <button
            className={`${styles["nav-menu"]} ${
              abaAtiva === "desvincular" ? styles["active"] : ""
            }`}
            onClick={() => setAbaAtiva("desvincular")}
          >
            Desvincular Candidato
          </button>
          <button
            className={`${styles["nav-menu"]} ${
              abaAtiva === "matricula" ? styles["active"] : ""
            }`}
            onClick={() => setAbaAtiva("matricula")}
          >
            Enviar Matrícula
          </button>
        </div>

        {/* SEÇÃO NOTIFICAÇÃO */}
        {abaAtiva === "notificacao" && (
          <section>
            <div className={styles["h22"]}>
              <h2>FORMATADOR NOTIFICAÇÃO</h2>
            </div>

            <div className={styles["inserir-area"]}>
              <textarea
                placeholder="Cole aqui os dados para a notificação financeira..."
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
              />
              <div className={styles["resultados-area"]}>
                {notificacao.resultados.map((r, i) => (
                  <div key={i} className={styles["resultados-item"]}>
                    <pre>{JSON.stringify(r, null, 2)}</pre>
                    <button
                      className={styles["botao-copiar"]}
                      onClick={() => handleEnviar(r)}
                    >
                      Enviar
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles["botoes"]}>
              <button
                className={styles["formatar"]}
                onClick={() => notificacao.formatar(texto)}
              >
                Formatar
              </button>
              <button
                className={styles["apagar"]}
                onClick={() => limparResultados("notificacao")}
              >
                Limpar
              </button>
              <button
                className={styles["exportar"]}
                onClick={() => notificacao.exportar()}
              >
                Exportar CSV
              </button>
            </div>
          </section>
        )}

        {/* SEÇÃO VINCULAR */}
        {abaAtiva === "vincular" && (
          <section>
            <div className={styles["h22"]}>
              <h2>FORMATADOR VINCULAR</h2>
            </div>

            <div className={styles["inserir-area"]}>
              <textarea
                placeholder="Cole aqui os UUIDs dos agendamentos..."
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
              />
              <div className={styles["resultados-area"]}>
                {vincular.resultados.map((r, i) => (
                  <div key={i} className={styles["resultados-item"]}>
                    <pre>{JSON.stringify(r, null, 2)}</pre>
                    <button className={styles["botao-copiar"]} onClick={() => handleCopiar(r, i)}
                        style={{
                            backgroundColor:
                              copiadoIndex === i ? "#2e6592ff" : undefined,
                          }}
                        >
                          {copiadoIndex === i ? "Copiado!" : "Copiar"}</button>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles["botoes"]}>
              <button
                className={styles["formatar"]}
                onClick={() => { vincular.formatar(texto, cpf);setCopiadoIndex([]);}}
              >
                Formatar
              </button>
              <input
                className={styles["cpf"]}
                type="text"
                placeholder="Cole aqui o CPF"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
              />
              <button
                className={styles["apagar"]}
                onClick={() => limparResultados("vincular")}
              >
                Limpar
              </button>
              <button
                className={styles["exportar"]}
                onClick={() => vincular.exportar()}
              >
                Exportar CSV
              </button>
            </div>
          </section>
        )}

        {/* SEÇÃO DESVINCULAR */}
        {abaAtiva === "desvincular" && (
          <section>
            <div className={styles["h22"]}>
              <h2>FORMATADOR DESVINCULAR</h2>
            </div>

            <div className={styles["inserir-area"]}>
              <textarea
                placeholder="Cole aqui os UUIDs dos agendamentos..."
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
              />
              <div className={styles["resultados-area"]}>
                {desvincular.resultados.map((r, i) => (
                  <div key={i} className={styles["resultados-item"]}>
                    <pre>{JSON.stringify(r, null, 2)}</pre>
                      <button className={styles["botao-copiar"]} onClick={() => handleCopiar(r, i)}
                        style={{
                            backgroundColor:
                              copiadoIndex === i ? "#2e6592ff" : undefined,
                          }}
                        >
                          {copiadoIndex === i ? "Copiado!" : "Copiar"}</button>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles["botoes"]}>
              <button
                className={styles["formatar"]}
                onClick={() => {desvincular.formatar(texto, cpf); setCopiadoIndex([]);}}
              >
                Formatar
              </button>
              <input
                className={styles["cpf"]}
                type="text"
                placeholder="Cole aqui o CPF"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
              />
              <button
                className={styles["apagar"]}
                onClick={() => limparResultados("desvincular")}
              >
                Limpar
              </button>
              <button
                className={styles["exportar"]}
                onClick={() => desvincular.exportar()}
              >
                Exportar CSV
              </button>
            </div>
          </section>
        )}

        {/* SEÇÃO MATRÍCULA */}
        {abaAtiva === "matricula" && (
          <section>
            <div className={styles["h22"]}>
              <h2>FORMATADOR MATRÍCULA</h2>
            </div>

            <div className={styles["inserir-area"]}>
              <textarea
                placeholder="Cole aqui os dados para envio de matrícula..."
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
              />
              <div className={styles["resultados-area"]}>
                {matricula.resultados.map((r, i) => (
                  <div key={i} className={styles["resultados-item"]}>
                    <pre>{JSON.stringify(r, null, 2)}</pre>
                      <button className={styles["botao-copiar"]} onClick={() => handleCopiar(r, i)}
                        style={{
                            backgroundColor:
                              copiadoIndex === i ? "#2e6592ff" : undefined,
                          }}
                        >
                          {copiadoIndex === i ? "Copiado!" : "Copiar"}</button>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles["botoes"]}>
              <button
                className={styles["formatar"]}
                onClick={() => {matricula.formatar(texto); setCopiadoIndex([]);}}
              >
                Formatar
              </button>
              <button
                className={styles["apagar"]}
                onClick={() => limparResultados("matricula")}
              >
                Limpar
              </button>
              <button
                className={styles["exportar"]}
                onClick={() => matricula.exportar()}
              >
                Exportar CSV
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Formatadores2;
