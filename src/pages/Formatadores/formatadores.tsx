import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./formatadores.module.css";

const Ferramentas: React.FC = () => {
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState<"notificacao" | "vincular" | "desvincular" | "matricula">("notificacao");

  // === Funções simulando as originais ===
  const limparResultados = (secao: string) => console.log(`Limpando ${secao}`);
  const formatarNotificacao = () => console.log("Formatar notificação");
  const formatarVincular = () => console.log("Formatar vincular");
  const formatarDesvincular = () => console.log("Formatar desvincular");
  const formatarMatricula = () => console.log("Formatar matrícula");
  const exportarCsv = (tipo: string) => console.log(`Exportar CSV de ${tipo}`);
  const getMatricula = () => console.log("GET matrícula");

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

        <nav className={styles["lateral-nav"]}>
          <a onClick={() => navigate("/home")}>
            <i className="fas fa-home"></i>
            <span>Início</span>
          </a>
          <a className={styles["active"]}>
            <i className="fas fa-tools"></i>
            <span>Ferramentas</span>
          </a>
          <a onClick={() => navigate("/sobre")}>
            <i className="fas fa-book"></i>
            <span>Sobre</span>
          </a>
          <a onClick={() => navigate("/filtrocpf")}>
            <i className="fa-solid fa-filter"></i>
            <span>Filtro CPF</span>
          </a>
          <a onClick={() => navigate("/ajuda")}>
            <i className="fas fa-info-circle"></i>
            <span>Ajuda</span>
          </a>
        </nav>

        <div className={styles["assina"]} style={{ backgroundColor: "transparent" }}>
          <p style={{ color: "#b8b8b8" }}>@By Jefferson Levy</p>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className={styles["container"]}>
        {/* BOTÕES DE NAVEGAÇÃO ENTRE FORMATADORES */}
        <div className={styles["nav-menus"]}>
          <button
            className={`${styles["nav-menu"]} ${abaAtiva === "notificacao" ? styles["active"] : ""}`}
            onClick={() => setAbaAtiva("notificacao")}
          >
            Notificação Financeira
          </button>
          <button
            className={`${styles["nav-menu"]} ${abaAtiva === "vincular" ? styles["active"] : ""}`}
            onClick={() => setAbaAtiva("vincular")}
          >
            Vincular Candidato
          </button>
          <button
            className={`${styles["nav-menu"]} ${abaAtiva === "desvincular" ? styles["active"] : ""}`}
            onClick={() => setAbaAtiva("desvincular")}
          >
            Desvincular Candidato
          </button>
          <button
            className={`${styles["nav-menu"]} ${abaAtiva === "matricula" ? styles["active"] : ""}`}
            onClick={() => setAbaAtiva("matricula")}
          >
            Enviar Matrícula
          </button>
        </div>

        {/* SEÇÕES DE FORMATADORES */}
        {abaAtiva === "notificacao" && (
          <section>
            <div className={styles["h22"]}>
              <h2>FORMATADOR NOTIFICAÇÃO</h2>
            </div>
            <div className={styles["inserir-area"]}>
              <textarea placeholder="Cole aqui os dados para a notificação financeira..." />
              <div className={styles["resultados-area"]}></div>
            </div>
            <div className={styles["botoes"]}>
              <button className={styles["formatar"]} onClick={formatarNotificacao}>Formatar</button>
              <button className={styles["apagar"]} onClick={() => limparResultados("notificacao")}>Limpar</button>
              <button className={styles["exportar"]} onClick={() => exportarCsv("notificacao")}>Exportar CSV</button>
              <button className={styles["formatar"]} onClick={getMatricula}>Matricula (GET)</button>
              <input className={styles["cpf"]} type="text" placeholder="Coloque o CPF" />
            </div>
          </section>
        )}

        {abaAtiva === "vincular" && (
          <section>
            <div className={styles["h22"]}><h2>FORMATADOR VINCULAR</h2></div>
            <div className={styles["inserir-area"]}>
              <textarea placeholder="Cole aqui os UUIDs dos agendamentos..." />
              <div className={styles["resultados-area"]}></div>
            </div>
            <div className={styles["botoes"]}>
              <button className={styles["formatar"]} onClick={formatarVincular}>Formatar</button>
              <input className={styles["cpf"]} type="text" placeholder="Cole aqui o CPF" />
              <button className={styles["apagar"]} onClick={() => limparResultados("vincular")}>Limpar</button>
              <button className={styles["exportar"]} onClick={() => exportarCsv("vincular")}>Exportar CSV</button>
            </div>
          </section>
        )}

        {abaAtiva === "desvincular" && (
          <section>
            <div className={styles["h22"]}><h2>FORMATADOR DESVINCULAR</h2></div>
            <div className={styles["inserir-area"]}>
              <textarea placeholder="Cole aqui os UUIDs dos agendamentos..." />
              <div className={styles["resultados-area"]}></div>
            </div>
            <div className={styles["botoes"]}>
              <button className={styles["formatar"]} onClick={formatarDesvincular}>Formatar</button>
              <input className={styles["cpf"]} type="text" placeholder="Cole aqui o CPF" />
              <button className={styles["apagar"]} onClick={() => limparResultados("desvincular")}>Limpar</button>
              <button className={styles["exportar"]} onClick={() => exportarCsv("desvincular")}>Exportar CSV</button>
            </div>
          </section>
        )}

        {abaAtiva === "matricula" && (
          <section>
            <div className={styles["h22"]}><h2>FORMATADOR MATRÍCULA</h2></div>
            <div className={styles["inserir-area"]}>
              <textarea placeholder="Cole aqui os dados para envio de matrícula..." />
              <div className={styles["resultados-area"]}></div>
            </div>
            <div className={styles["botoes"]}>
              <button className={styles["formatar"]} onClick={formatarMatricula}>Formatar</button>
              <button className={styles["apagar"]} onClick={() => limparResultados("matricula")}>Limpar</button>
              <button className={styles["exportar"]} onClick={() => exportarCsv("matricula")}>Exportar CSV</button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Ferramentas;
