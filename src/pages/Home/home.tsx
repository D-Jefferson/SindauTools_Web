import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";
import "../../assets/global.css";
import FotoBiometria from "../FotoBiometria/fotobiometria";
import Matricula from "../Matricula/matricula";
import { fmtCpf } from "../../utils/formatos";

const ConsultaCandidato: React.FC = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("sindautools-theme") || "dark");
  const [pageMode, setPageMode] = useState<"matricula" | "fotobiometria" | "grades">("matricula");
  const [sliding, setSliding] = useState<"left" | "right" | null>(null);

  const [cpfInput, setCpfInput] = useState("");
  const [resultado, setResultado] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("sindautools-theme", theme);
  }, [theme]);

  const changeMode = (newMode: typeof pageMode, direction: "left" | "right") => {
    if (newMode === pageMode) return;
    setSliding(direction);
    setResultado(null);
    setTimeout(() => {
      setPageMode(newMode);
      setSliding(null);
    }, 180);
  };

  const handleBuscar = async () => {
    if (!cpfInput) return;
    setLoading(true);
    setErro(null);
    try {
    } catch (e) {
      setErro("Erro ao buscar matrícula.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="st-page-wrapper">
      <main className="st-main-content">
        <header className="st-header">
          <div className="st-logo">
            SINDAU<span>TOOLS</span>
          </div>

          <div className="st-mode-switcher">
            <button
              className={`st-mode-btn ${pageMode === "fotobiometria" ? "active" : ""}`}
              onClick={() => changeMode("fotobiometria", "left")}
            >
              <i className="fas fa-camera"></i>
              <span>Foto/Biometria</span>
            </button>
            <button
              className={`st-mode-btn ${pageMode === "matricula" ? "active" : ""}`}
              onClick={() => changeMode("matricula", "right")}
            >
              <i className="fas fa-id-card"></i>
              <span>Matrículas</span>
            </button>
            <button
              className={`st-mode-btn ${pageMode === "grades" ? "active" : ""}`}
              onClick={() => changeMode("grades", "right")}
            >
              <i className="fas fa-th"></i>
              <span>Grades</span>
            </button>
          </div>

          <div className="st-header-actions">
            <button
              className={`st-theme-toggle ${theme === "dark" ? "is-dark" : "is-light"}`}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              title="Alternar tema"
            >
              <span className="st-theme-toggle__track">
                <span className="st-theme-toggle__thumb">
                  {theme === "dark" ? (
                    <i className="fas fa-moon"></i>
                  ) : (
                    <i className="fas fa-sun"></i>
                  )}
                </span>
                <span className="st-theme-toggle__label-left">
                  <i className="fas fa-sun"></i>
                </span>
                <span className="st-theme-toggle__label-right">
                  <i className="fas fa-moon"></i>
                </span>
              </span>
            </button>
            <div className="st-divider"></div>

            <div className="st-user-profile">
              <div className="st-avatar">S</div>
            </div>
            <button className="st-logout-btn" onClick={() => navigate("/")}>
              <i className="fas fa-sign-out-alt"></i> Sair
            </button>
          </div>
        </header>

        {/* BUSCA */}
        <div
          className={`st-search-wrapper ${resultado ? "is-results-mode" : ""} ${
            sliding === "left"
              ? "page-slide-left"
              : sliding === "right"
              ? "page-slide-right"
              : ""
          }`}
        >
          {pageMode === "matricula" && <Matricula />}

          {pageMode === "fotobiometria" && <FotoBiometria />}

          {pageMode === "grades" && (
            <>
              <div className="st-search-titles">
                <h1>Grades</h1>
                <p>Filtre as grades por dia.</p>
              </div>
              <div className="st-input-group">
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  disabled={loading}
                  autoFocus
                />
                <button onClick={() => alert(`Filtrar grades do dia ${dateFilter}`)}>
                  FILTRAR
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ConsultaCandidato;