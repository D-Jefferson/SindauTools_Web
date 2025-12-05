import React from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/global.css";

const Sobre2: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      {/* MENU LATERAL */}
      <aside className="menu-lateral-inicio">
        <div className="menu-lateral-logo">
          <h1>
            SINDAU<span>TOOLS</span>
          </h1>
        </div>

        <div className="perfil">
          <button className="button1">DEMO</button>
        </div>

        <nav className="lateral-nav">
          <a onClick={() => navigate("/demo/home")}>
            <i className="fas fa-home"></i>
            <span>Início</span>
          </a>

          <a onClick={() => navigate("/demo/ferramentas")}>
            <i className="fas fa-tools"></i>
            <span>Ferramentas</span>
          </a>

          <a onClick={() => navigate("/demo/sobre")} className="active">
            <i className="fas fa-book"></i>
            <span>Informações</span>
          </a>

          <a onClick={() => navigate("/demo/CloudBeaver")}>
            <i className="fa-solid fa-database"></i>
            <span>Banco de Dados</span>
          </a>
        </nav>

        <div className="assina" style={{ backgroundColor: "rgba(240,248,255,0)" }}>
          <p style={{ color: "#b8b8b8" }}>@By Jefferson Levy</p>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="container">
        <div className="pesquisa">
          <div className="sub-info">
            <a onClick={() => navigate("/home")}>Início</a>
            <span className="separado">/</span>
            <span>Sobre</span>
          </div>
        </div>

        <div className="h22">
          <h2>Sobre</h2>
        </div>

        <div className="extensoes">
          <div className="h22">
            <h3 style={{ color: "#b8b8b8" }}>SindauTools</h3>
          </div>

          <div className="extensao">
            <i className="fas fa-puzzle-piece extensao-fundo"></i>
            <div className="extensao-descricao" style={{ width: "90%" }}>
              Essa parte do <strong>SindauTools</strong> é apenas uma demonstração
              das funcionalidades desenvolvidas simulando um ambiente de banco de
              dados utilizando o <strong>CloudBeaver</strong>. O objetivo principal é
              apresentar as capacidades e recursos que podem ser integrados ao
              sistema para melhorar a gestão de dados e facilitar o trabalho do
              suporte técnico.
              <br />
              <br />
              Minha missão é fornecer soluções tecnológicas que permitam que
              minha equipe e eu possamos crescer e aprimorar nosso conhecimento
              e eficiência.
              <br />
              <br />
              Projeto criado voluntariamente que aumentou a eficiência de
              resolução de tickets em cerca de <strong>65%</strong>.
            </div>
          </div>

          <div className="h22">
            <h3 style={{ color: "#b8b8b8" }}>Projeto</h3>
          </div>

          <div className="extensao">
            <i className="fas fa-puzzle-piece extensao-fundo"></i>
            <div className="extensao-titulo">Veja o projeto no GitHub</div>
            <div className="extensao-descricao">
              <p className="paragrafo">
                <a
                  href="https://github.com/D-Jefferson/SindauTools_Web"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "rgb(225,225,225)" }}
                >
                  https://github.com/D-Jefferson/SindauTools_Web
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Sobre2;
