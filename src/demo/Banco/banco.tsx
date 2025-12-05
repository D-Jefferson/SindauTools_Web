import { useNavigate } from "react-router-dom";
import "../../assets/global.css";
import CloudBeaver from "../../components/CloudBeaver/cloudbeaver";

const Banco: React.FC = () => {
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
          <button className="button1">DEMO</button>
        </div>

        <nav className="lateral-nav">
          <a onClick={() => navigate("/demo/home")} >
            <i className="fas fa-home"></i>
            <span>Início</span>
          </a>

          <a onClick={() => navigate("/demo/ferramentas")}>
            <i className="fas fa-tools"></i>
            <span>Ferramentas</span>
          </a>

          <a onClick={() => navigate("/demo/sobre")}>
            <i className="fas fa-book"></i>
            <span>Informações</span>
          </a>

          <a className="active">
            <i className="fa-solid fa-database"></i>
            <span>Banco de Dados</span>
          </a>
        </nav>

        <div className="assina">
          <p>@By Jefferson Levy</p>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="container" style={{padding:"0"}}>
        <CloudBeaver />
      </main>
    </div>
  );
};

export default Banco;
