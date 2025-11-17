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
          <div className="perfil-icone">S</div>
          <div className="perfil-info">
            <div className="perfil-nome">Suporte</div>
            <div className="perfil-tipo">Administrador</div>
          </div>
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
              O <strong>SindauTools</strong> é uma plataforma desenvolvida
              especialmente para otimizar a rotina de quem lida diariamente com
              tickets de demanda relacionada a API, Banco de Dados e atendimento
              ao público-alvo do Sindicato. O <strong>SindauTools_Web</strong>{" "}
              oferece uma experiência mais fluida, produtiva e alinhada às
              necessidades do suporte técnico do Sindauto-BA.
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
            <h3 style={{ color: "#b8b8b8" }}>Recursos</h3>
          </div>

          <div className="extensao">
            <i className="fas fa-puzzle-piece extensao-fundo"></i>
            <div className="extensao-descricao" style={{ width: "90%" }}>
              <p>
                <strong>Formatadores:</strong> Os formatadores têm como objetivo
                transformar dados em JSON para enviar pela API. Os dados são
                coletados em linhas do banco de dados e, após formatados, são
                enviados para a empresa parceira.
              </p>
              <p>
                <strong>Dashboard / Estatísticas:</strong> Exibe e monitora o
                uso dos formatadores padrões, permitindo uma análise completa do
                desempenho e da utilização das ferramentas.
              </p>
              <p>
                <strong>Central de Ajuda:</strong> Criada para auxiliar não
                apenas os que têm acesso ao banco de dados, mas também
                estagiários e analistas N1, oferecendo orientações úteis para o
                atendimento ao público — os CFCs.
              </p>
            </div>
          </div>

          <div className="h22">
            <h3 style={{ color: "#b8b8b8" }}>Equipe</h3>
          </div>

          <div className="extensao">
            <i className="fas fa-puzzle-piece extensao-fundo"></i>
            <div className="extensao-descricao">
              O SindauTools é desenvolvido e mantido por um desenvolvedor
              prestes a se formar e dedicado, comprometido em fornecer as
              melhores soluções para nossa equipe de suporte.
              <div className="equipe-grid">
                <div className="cartao-membro">
                  <div className="foto-membro">J</div>
                  <div className="nome-membro">Jefferson Levy</div>
                  <div className="cargo-membro">Desenvolvedor</div>
                </div>
              </div>
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
