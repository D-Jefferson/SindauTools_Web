import React from "react";
import "../../assets/global.css";
import { useNavigate } from "react-router-dom";


const Home: React.FC = () => {
  const formatador1 = () =>
    navigate("/ferramentas", { state: { abaInicial: "notificacao" } });

  const formatador2 = () =>
    navigate("/ferramentas", { state: { abaInicial: "vincular" } });

  const formatador3 = () =>
    navigate("/ferramentas", { state: { abaInicial: "desvincular" } });

  const formatador4 = () =>
    navigate("/ferramentas", { state: { abaInicial: "matricula" } });

  const abrirVideo = () => console.log("Abrir vídeo");
  const fecharVideo = () => console.log("Fechar vídeo");
  const navigate = useNavigate();

  return (
    <div className="page-container">
      {/* MENU LATERAL */}
      <aside className="menu-lateral-inicio" id="menu-lateral-inicio">
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
          <a onClick={() => navigate("/home")} className="active">
            <i className="fas fa-home"></i>
            <span>Início</span>
          </a>

          <a onClick={() => navigate("/ferramentas")}>
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
        
        <div className="assina" style={{ backgroundColor: "rgba(240,248,255,0)" }}>
          <p style={{ color: "#b8b8b8" }}>@By Jefferson Levy</p>
        </div>

      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="container">
        <div className="pesquisa">
          <div className="barra-pesquisa">
            <div className="sub-info">
              <a href="#">Início</a>
            </div>
          </div>

          <div className="alerta-aute" onClick={abrirVideo}>
            <div className="noti" data-tooltip="Notificações">
              <i className="fas fa-bell"></i>
              {/*<span className="contador-noti">0</span>*/}
            </div>
          </div>
        </div>

        <div className="h22">
          <h2>Estatísticas</h2>
        </div>

        <div className="infos">
          {[
            { icon: "fa-file-alt", titulo: "Notificações Financeiras" },
            { icon: "fa-link", titulo: "Candidatos Vinculados" },
            { icon: "fa-unlink", titulo: "Candidatos Desvinculados" },
            { icon: "fa-envelope", titulo: "Matrículas Enviadas" },
          ].map((item, i) => (
            <div className="cartao-info" key={i}>
              <i className={`fas ${item.icon} cartao-info-fundo`}></i>
              <div className="cartao-info-titulo">{item.titulo}</div>
              <div className="cartao-info-valor">0</div>
              <div className="cartao-info-status positivo">
                <i className="fa-solid fa-arrow-up-from-bracket"></i>
                Total Formatado
              </div>
            </div>
          ))}
        </div>

        <div className="h22">
          <h2>Formatadores</h2>
        </div>

        <div className="menu">
          <div className="ferramenta" onClick={formatador1}>
            <div className="icone-ferramenta">
              <i className="fas fa-bell notification-icon"></i>
            </div>
            <h2 className="titulo-ferramenta">NOTIFICAÇÃO FINANCEIRA</h2>
            <p className="descricao-ferramenta">
              Envie notificação financeira dos candidatos formatando em JSON
              para enviar via API.
            </p>
          </div>

          <div className="ferramenta" onClick={formatador2}>
            <div className="icone-ferramenta">
              <i className="fas fa-link link-icon"></i>
            </div>
            <h2 className="titulo-ferramenta">VINCULAR CANDIDATO</h2>
            <p className="descricao-ferramenta">
              Vincule candidatos a agendamentos formatando em JSON para enviar
              via API.
            </p>
          </div>

          <div className="ferramenta" onClick={formatador3}>
            <div className="icone-ferramenta">
              <i className="fas fa-unlink unlink-icon"></i>
            </div>
            <h2 className="titulo-ferramenta">DESVINCULAR CANDIDATO</h2>
            <p className="descricao-ferramenta">
              Desvincule candidatos a agendamentos formatando em JSON para enviar via API.
            </p>
          </div>

          <div className="ferramenta" onClick={formatador4}>
            <div className="icone-ferramenta">
              <i className="fas fa-user-graduate send-icon"></i>
            </div>
            <h2 className="titulo-ferramenta">ENVIAR MATRÍCULA</h2>
            <p className="descricao-ferramenta">
              Envie matrículas dos candidatos formatando em JSON para enviar via API.
            </p>
          </div>
        </div>

        <div id="popupVideo" className="popupVideo">
          <div className="popup-content">
            <button className="close-btn" onClick={fecharVideo}>
              <i className="fa-solid fa-xmark"></i>
            </button>
            <video id="meuVideo" controls>
              <source src="icones/SindauTools.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </main>

      <div id="fundo-sobrepor" className="fundo-sobrepor">
        <span id="fechar" className="fechar">
          &times;
        </span>
        <div className="sobrepor" id="conteudo-sobrepor"></div>
      </div>
    </div>
  );
};

export default Home;
