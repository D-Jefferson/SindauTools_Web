import React from "react";
import { useNavigate } from "react-router-dom";
import sindatImg from "../../assets/sindat.png";


const Sobre: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --primeira-cor: #1f1f1f;
          --segunda-cor: #2c2c2c;
          --terceira-cor: #c4404b;
          --cor-texto: #f5f5f5;
          --fundo: #2c2c2c;
          --sombra: 0 4px 20px rgba(0, 0, 0, 0.6);
        }

        .t-container {
          display: flex;
          flex-direction: column;
          gap: 40px;
          padding: 20px;
          background-color: var(--fundo);
          color: var(--cor-texto);
        }

        .t-hero {
          background-color: var(--primeira-cor);
          border-bottom: 4px solid var(--terceira-cor);
          padding: 60px 40px;
          display: flex;
          align-items: center;
          gap: 40px;
          border-radius: 8px;
        }

        .t-hero-content { flex: 1; }
        .t-hero-title { font-size: 2.5rem; font-weight: 900; line-height: 1.1; margin-bottom: 20px; text-transform: uppercase; }
        .t-hero-title span { color: var(--terceira-cor); }
        
        .t-btn {
          display: inline-block;
          background-color: var(--terceira-cor);
          color: white;
          padding: 15px 30px;
          border-radius: 4px;
          font-weight: bold;
          text-decoration: none;
          text-transform: uppercase;
          transition: 0.3s;
          border: none;
          cursor: pointer;
        }

        .t-btn:hover { filter: brightness(1.2); transform: translateY(-2px); }

        .t-section {
          display: flex;
          align-items: center;
          gap: 60px;
          padding: 60px 40px;
          border-radius: 8px;
        }

        .t-bg-1 { background-color: var(--segunda-cor); }
        .t-bg-2 { background-color: var(--primeira-cor); }
        .t-reverse { flex-direction: row-reverse; }

        .t-text-box { flex: 1; border-left: 4px solid var(--terceira-cor); padding-left: 20px; }
        .t-text-box h2 { font-size: 1.8rem; margin-bottom: 15px; text-transform: uppercase; }

        .t-img-placeholder {
          flex: 1;
          background: var(--primeira-cor);
          height: 300px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px dashed var(--terceira-cor);
          color: var(--terceira-cor);
          font-weight: bold;
        }

        .t-skin-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; flex: 1; }
        .t-skin-item { background: var(--primeira-cor); height: 150px; border-bottom: 3px solid var(--terceira-cor); border-radius: 4px; }

        @media (max-width: 768px) {
          .t-hero, .t-section { flex-direction: column; text-align: center; }
          .t-text-box { border-left: none; border-top: 4px solid var(--terceira-cor); padding: 20px 0; }
        }
      `}} />
  
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
          <a onClick={() => navigate("/home")}>
            <i className="fas fa-home"></i>
            <span>Início</span>
          </a>
          <a onClick={() => navigate("/ferramentas")}>
            <i className="fas fa-tools"></i>
            <span>Ferramentas</span>
          </a>
          <a className="active" onClick={() => navigate("/sobre")}>
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

        <div className="assina" style={{ backgroundColor: "rgba(240,248,255,0)" }}>
          <p style={{ color: "#b8b8b8" }}>@By Jefferson Levy</p>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL ESTILO TLAUNCHER */}
      <main className="container">
        <div className="t-container">
          
          {/* HERO */}
          <header className="t-hero">
            <div className="t-hero-content">
              <h1 className="t-hero-title">Sindau<span>Tools</span></h1>
              <p style={{marginBottom: '30px', opacity: 0.8}}>Otimização de rotina, banco de dados e atendimento técnico em um só lugar.</p>
              <button className="t-btn" onClick={() => window.open('https://github.com/D-Jefferson/SindauTools_Web', '_blank')}>Ver no GitHub</button>
            </div>
            <img src={sindatImg} className="t-img-placeholder" alt="Sindat" />
          </header>

          {/* SECTION 1 */}
          <section className="t-section t-bg-1">
            <div className="t-text-box">
              <h2>História</h2>
              <p>Projeto criado voluntariamente, responsável por aumentar a eficiência na resolução de tickets em cerca de 65%.
Inicialmente, a empresa parceira disponibilizou apenas a API para a execução das demandas. No início, as requisições eram realizadas diretamente na API, o que tornava o processo mais técnico e menos produtivo.

Diante desse cenário, surgiu a iniciativa de desenvolver uma interface web para a API, dando origem ao SindauTools Web, atualmente utilizado diariamente pela equipe de suporte, proporcionando mais agilidade, padronização e eficiência no atendimento.</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Sobre;