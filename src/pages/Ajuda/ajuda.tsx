import React from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/global.css";

const Ajuda: React.FC = () => {
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
          <a onClick={() => navigate("/home")}>
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
          <a className="active" onClick={() => navigate("/ajuda")}>
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
          <div className="pesquisa-ajuda">
            <input type="text" placeholder="Pesquisar na Central de Ajuda" />
            <button className="botao-pesquisa">
              <i className="fas fa-search"></i>
            </button>
          </div>

          <div className="alerta-aute">
            <div className="noti" data-tooltip="Notificações">
              <i className="fas fa-bell"></i>
              <span className="contador-noti">0</span>
            </div>
          </div>
        </div>

        <div className="sub-info">
          <a onClick={() => navigate("/home")}>Início</a>
          <span className="separado">/</span>
          <span>Ajuda</span>
        </div>

        <div className="h22">
          <h2>Central de Ajuda</h2>
        </div>

        <div className="abas-filtro">
          <div className="aba-filtro ativo">Todos</div>
          <div className="aba-filtro">Erros Comuns</div>
          <div className="aba-filtro">Contatos</div>
        </div>

        <div className="grade-ajuda">
          {/* AJUDA 1 */}
          <div className="ajuda-itens">
            <div className="ajuda-icone vermelho">
              <i className="fas fa-minus"></i>
            </div>
            <div className="ajuda-conteudo">
              <h3>Notificação Financeira</h3>
              <p>
                "A situação financeira do candidato não permite agendamento."
                <br />
                Verifique se o boleto foi pago no Sistema de Gestão Sindauto e
                abra um ticket caso esteja pago.
              </p>
            </div>
          </div>

          {/* CONTATOS */}
          {[
            {
              icone: "fa-address-book",
              cor: "azul",
              titulo: "Gerencia Net / EFI",
              linhas: [
                "Número: +55 (31) 3603-0822 | +55 (31) 4000-1234",
                "E-mail: atendimento@sejaefi.com.br",
              ],
            },
            {
              icone: "fa-address-book",
              cor: "azul",
              titulo: "CRT / Detran",
              linhas: [
                "Número: +55 (71) 3116-2205 | +55 (71) 3116-2405",
                "E-mail: crt.biometria@detran.ba.gov.br",
              ],
            },
            {
              icone: "fa-address-book",
              cor: "azul",
              titulo: "Grupo Criar / E-Prova",
              linhas: [
                "Número: +55 (16) 3512-9000 / +55 (16) 2102-2400",
                "E-mail: grupocriar@grupocriar.com.br",
              ],
            },
            {
              icone: "fa-address-book",
              cor: "azul",
              titulo: "Contatos | Sindauto - BA",
              linhas: [
                "Número: +55 (71) 3995-0185 / +55 (71) 99152-3653",
                "E-mail: sindicato@sindautoba.com.br",
              ],
            },
            {
              icone: "fa-address-book",
              cor: "azul",
              titulo: "Emails | Sindauto - BA",
              linhas: [
                "Sindicato@sindautoba.com.br | Suporte@sindautoba.com.br",
                "Financeiro@sindautoba.com.br | Conecta@sindautoba.com.br",
              ],
            },
          ].map((item, i) => (
            <div className="ajuda-itens" key={i}>
              <div className={`ajuda-icone ${item.cor}`}>
                <i className={`fas ${item.icone}`}></i>
              </div>
              <div className="ajuda-conteudo">
                <h3>{item.titulo}</h3>
                {item.linhas.map((l, idx) => (
                  <p key={idx}>{l}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Ajuda;
