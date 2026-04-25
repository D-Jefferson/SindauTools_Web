import React, { useState } from "react";
import { buscarFotobiometria } from "../../api/Sindauto/fotobiometria";
import "../Home/home.css";

const fmtCpf = (v: string) => {
  const r = v.replace(/\D/g, "");
  if (r.length > 9) return `${r.slice(0, 3)}.${r.slice(3, 6)}.${r.slice(6, 9)}-${r.slice(9, 11)}`;
  if (r.length > 6) return `${r.slice(0, 3)}.${r.slice(3, 6)}.${r.slice(6)}`;
  if (r.length > 3) return `${r.slice(0, 3)}.${r.slice(3)}`;
  return r;
};
const fmtDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString("pt-BR") : "—";
const fmtTime = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    : "—";

const FotoBiometria: React.FC = () => {
  const [fbDataInicio, setFbDataInicio] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [fbDataFim, setFbDataFim] = useState(
    () => new Date().toISOString().split("T")[0]
  );

  const [fbData, setFbData] = useState<any[]>([]);
  const [fbLoading, setFbLoading] = useState(false);
  const [fbErro, setFbErro] = useState("");

  const [fbPresenca, setFbPresenca] = useState<Record<string, "Presente" | "Ausente">>(
    () => {
      try {
        return JSON.parse(localStorage.getItem("fb_presenca") || "{}");
      } catch {
        return {};
      }
    }
  );

  const salvarPresenca = (cpf: string, status: "Presente" | "Ausente") => {
    const novo = { ...fbPresenca };
    if (novo[cpf] === status) {
      delete novo[cpf];
    } else {
      novo[cpf] = status;
    }
    setFbPresenca(novo);
    localStorage.setItem("fb_presenca", JSON.stringify(novo));
  };

const handleBuscar = async () => {
  setFbLoading(true);
  setFbErro("");
  setFbData([]);
  try {
    const dados = await buscarFotobiometria(fbDataInicio, fbDataFim);
    setFbData(dados);
  } catch (e: any) {
    setFbErro(e.message || "Erro ao buscar dados.");
  } finally {
    setFbLoading(false);
  }
};

  const totalPresente = Object.values(fbPresenca).filter((s) => s === "Presente").length;
  const totalAusente = Object.values(fbPresenca).filter((s) => s === "Ausente").length;

  return (
    <div className="fb-container">
      <div className="st-search-titles">
        <h1>
          Foto <span>Biometria</span>
        </h1>
        <p>Busque os registros biométricos por período.</p>
      </div>

      <div className="fb-filter-row">
        <div className="fb-filter-group">
          <label>Data início</label>
          <input
            type="date"
            value={fbDataInicio}
            onChange={(e) => setFbDataInicio(e.target.value)}
            className="fb-input"
          />
        </div>
        <div className="fb-filter-group">
          <label>Data fim</label>
          <input
            type="date"
            value={fbDataFim}
            onChange={(e) => setFbDataFim(e.target.value)}
            className="fb-input"
          />
        </div>
        <button
          className="fb-btn-buscar"
          onClick={handleBuscar}
          disabled={fbLoading}
        >
          {fbLoading ? (
            <i className="fas fa-circle-notch fa-spin" />
          ) : (
            <i className="fas fa-search" />
          )}
          {fbLoading ? " Buscando..." : " Buscar"}
        </button>
      </div>

      {fbErro && (
        <div className="st-erro-msg">
          <i className="fas fa-exclamation-circle" /> {fbErro}
        </div>
      )}

      {fbData.length > 0 && (
        <div className="fb-table-card">
          <div className="fb-stats-row">
            <div className="fb-stat-chip">
              <span className="fb-stat-count">{fbData.length}</span>
              <div className="fb-stat-labels">
                <span className="top">registros</span>
                <span className="bot">encontrados</span>
              </div>
              <span className="fb-sort-badge">
                <i className="fas fa-arrow-down" /> Data crescente
              </span>
            </div>
            <div className="fb-actions-right">
              {totalPresente > 0 && (
                <span className="fb-status-badge verde">
                  <i className="fas fa-check" /> {totalPresente} Presente{totalPresente !== 1 ? "s" : ""}
                </span>
              )}
              {totalAusente > 0 && (
                <span className="fb-status-badge vermelho">
                  <i className="fas fa-times" /> {totalAusente} Ausente{totalAusente !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>

          {/* Tabela */}
          <div className="fb-table-scroll">
            <table className="fb-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nome</th>
                  <th>CPF</th>
                  <th>CFC</th>
                  <th className="sorted">
                    <i className="fas fa-sort-amount-down" /> Data / Hora
                  </th>
                  <th>Local</th>
                  <th>Presença</th>
                </tr>
              </thead>
              <tbody>
                {fbData.map((item, i) => {
                  const cpf = item.candidatoCpf || "";
                  const status = fbPresenca[cpf];
                  const initials = (item.candidatoNome || "?")
                    .trim()
                    .split(" ")
                    .filter(Boolean)
                    .map((p: string) => p[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase();

                  return (
                    <tr
                      key={i}
                      className={
                        status === "Presente"
                          ? "fb-row-presente"
                          : status === "Ausente"
                          ? "fb-row-ausente"
                          : ""
                      }
                    >
                      <td className="fb-td-idx">{i + 1}</td>
                      <td>
                        <div className="fb-name-cell">
                          <div
                            className={`fb-avatar ${
                              status === "Presente"
                                ? "presente"
                                : status === "Ausente"
                                ? "ausente"
                                : ""
                            }`}
                          >
                            {initials}
                          </div>
                          <div>
                            <div className="fb-td-name">{item.candidatoNome || "—"}</div>
                            {item.candidatoMatricula && (
                              <div className="fb-td-name-sub">
                                Mat. {item.candidatoMatricula}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="fb-td-cpf">{fmtCpf(cpf)}</td>

                      <td className="fb-td-cfc">{item.cfcNome || "—"}</td>

                      <td>
                        <div className="fb-td-dt">
                          <span className="fb-date">{fmtDate(item.dataHora)}</span>
                          <span className="fb-time">{fmtTime(item.dataHora)}</span>
                        </div>
                      </td>
                      <td>
                        <span className="fb-local-badge">
                          <i className="fas fa-map-marker-alt" />
                          {item.localDescricao || "—"}
                        </span>
                      </td>
                      <td>
                        <div className="fb-td-presenca">
                          <button
                            className={`fb-btn-presenca presente${
                              status === "Presente" ? " ativo" : ""
                            }`}
                            onClick={() => salvarPresenca(cpf, "Presente")}
                            title="Marcar Presente"
                          >
                            <i className="fas fa-check" />
                          </button>
                          <button
                            className={`fb-btn-presenca ausente${
                              status === "Ausente" ? " ativo" : ""
                            }`}
                            onClick={() => salvarPresenca(cpf, "Ausente")}
                            title="Marcar Ausente"
                          >
                            <i className="fas fa-times" />
                          </button>
                          {status && (
                            <span
                              className={`fb-status-badge ${
                                status === "Presente" ? "verde" : "vermelho"
                              }`}
                            >
                              {status}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!fbLoading && fbData.length === 0 && !fbErro && (
        <div className="fb-empty">
          <i className="fas fa-camera" />
          <p>Selecione um período e clique em Buscar.</p>
        </div>
      )}
    </div>
  );
};

export default FotoBiometria;