
import React from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const entrar = () => {
    navigate("/home");
  };

  const abrirVideo = () => {
    const popup = document.getElementById("popupVideo");
    if (popup) popup.style.display = "flex";
  };

  const fecharVideo = () => {
    const popup = document.getElementById("popupVideo");
    const video = document.getElementById("meuVideo") as HTMLVideoElement;
    if (popup) popup.style.display = "none";
    if (video) video.pause();
  };

  return (
    <div className="pagina-login">
      <div className="barra-lateral">
        <div className="logotipo">
          SINDAU<span>TOOLS</span>
        </div>
        <div className="info-lateral">
          <h1>Bem-vindo(a)</h1>
          <p>
            SindauTools foi desenvolvido
            especialmente para otimizar as operações dos analistas de dados e
            analistas de suporte técnico do Sindauto-BA. Com foco na agilidade,
            praticidade e eficiência, este sistema integrado de gerenciamento
            visa transformar a maneira como os analistas lidam com tickets e
            demandas relacionadas à API e Banco de Dados.
          </p>
        </div>
      </div>

      <div className="conteudo-principal">
        <div className="container-login">
          <div className="cabecalho-login">
            <div className="icone-login">
              <div className="circulo-icone">
                <i className="fas fa-right-to-bracket" style={{ fontSize: 32, color: "#e74c3c" }}></i>
              </div>
            </div>
            <h1>Acesso ao Sistema</h1>
          </div>

          <div className="info-perfil">
            <div className="icone-perfil">
              <i className="fas fa-user" style={{ fontSize: 32, color: "#e74c3c" }}></i>
            </div>

            <div className="texto-perfil">
              <div className="rotulo-perfil">Perfil de acesso</div>
              <div className="valor-perfil">SUPORTE</div>
            </div>
            <div className="ponto-status"></div>
          </div>

          <button className="botao" onClick={entrar}>
            ENTRAR
          </button>

          <div className="rodape-login">
            © 2025 Jefferson Levy. Todos os direitos reservados.
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
