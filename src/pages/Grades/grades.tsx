import React, { useState } from "react";
import { buscarGrades } from "../../api/Sindauto/grades";
import "../Home/home.css";
import {fmtDate} from "../../utils/formatos"
import { useDemo } from "../../context/demo";
import { DEMO_GRADES } from "../../api/Demo/dadosficticios";


const SITUACAO = [
  { id: "", nome: "TODAS AS GRADES" },
  { id: "LIBERADO", nome: "LIBERADO" },
  { id: "EM_PROGRESSO", nome: "EM PROGRESSO" },
  { id: "EM_ABERTO", nome: "EM ABERTO" },
  { id: "CANCELADA", nome: "CANCELADA" },
  { id: "FINALIZADA", nome: "FINALIZADA" },
];

const Grades: React.FC = () => {
  const [situacaoDataInicio, setSituacaoDataInicio] = useState(() => new Date().toISOString().split("T")[0]);
  const [situacaoDataFinal, setSituacaoDataFinal] = useState(() => new Date().toISOString().split("T")[0]);
  const [situacao, setSituacao] = useState<string>();
  const [situacaoData, setSituacaoData] = useState<any[]>([]);
  const [situacaoLoading, setSituacaoLoading] = useState(false);
  const [situacaoErro, setSituacaoErro] = useState("");
  const { isDemo } = useDemo();

const handleBuscar = async () => {
  setSituacaoLoading(true);
  setSituacaoErro("");
  setSituacaoData([]);
  try {
    if (isDemo) {
      await new Promise(r => setTimeout(r, 500));
      setSituacaoData(DEMO_GRADES);
      return;
    }
    const dados = await buscarGrades(situacaoDataInicio, situacaoDataFinal, situacao);
    setSituacaoData(dados);
  } catch (e: any) {
    setSituacaoErro(e.message || "Erro ao buscar dados.");
  } finally {
    setSituacaoLoading(false);
  }
};

  return (
    <div className="fb-container">
      <div className="st-search-titles">
        <h1>
          Grades <span>Disponíveis</span>
        </h1>
        <p>Busque os registros de grades por período.</p>
      </div>

      <div className="fb-filter-row">
        <div className="fb-filter-group">
          <label>Data início</label>
          <input
            type="date"
            value={situacaoDataInicio}
            onChange={(e) => setSituacaoDataInicio(e.target.value)}
            className="fb-input"
          />
        </div>
        <div className="fb-filter-group">
          <label>Data fim</label>
          <input
            type="date"
            value={situacaoDataFinal}
            onChange={(e) => setSituacaoDataFinal(e.target.value)}
            className="fb-input"
          />
        </div>
        <div className="fb-filter-group">
          <label>Situação</label>
          <select
            value={situacao}
            onChange={(e) => setSituacao(e.target.value)}
            className="fb-input"
          >
            {SITUACAO.map((l) => (
              <option key={l.id} value={l.id}>
                {l.nome}
              </option>
            ))}
          </select>
        </div>
        <button
          className="fb-btn-buscar"
          onClick={handleBuscar}
          disabled={situacaoLoading}
        >
          {situacaoLoading ? (
            <i className="fas fa-circle-notch fa-spin" />
          ) : (
            <i className="fas fa-search" />
          )}
          {situacaoLoading ? " Buscando..." : " Buscar"}
        </button>
      </div>

      {situacaoErro && (
        <div className="st-erro-msg">
          <i className="fas fa-exclamation-circle" /> {"Não há grades disponíveis para essa data."}
        </div>
      )}

      {situacaoData.length > 0 && (
        <div className="fb-table-card">
          <div className="fb-stats-row">
            <div className="fb-stat-chip">
              <span className="fb-stat-count">{situacaoData.length}</span>
              <div className="fb-stat-labels">
                <span className="top">registros</span>
                <span className="bot">encontrados</span>
              </div>
              <span className="fb-sort-badge">
                <i className="fas fa-arrow-down" /> Data crescente
              </span>
            </div>
          </div>

          <div className="fb-table-scroll">
            <table className="fb-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Instrutor</th>
                  <th>Turno</th>
                  <th>CFC</th>
                  <th className="sorted">
                    <i className="fas fa-sort-amount-down" /> Data / Hora
                  </th>
                  <th>Serviço</th>
                  <th>Situação</th>
                </tr>
              </thead>
              <tbody>
                {situacaoData.map((item, i) => {
                  const initials = (item.id);

                  return (
                    <tr>
                      <td className="fb-td-idx">{item.id}</td>
                      <td>
                        <div className="fb-name-cell">
                          <div>
                            <div className="fb-td-name">{item.instrutorNome || "—"}</div>
                          </div>
                        </div>
                      </td>

                      <td className="fb-td-cpf">                        
                        <span className="fb-local-badge">
                          {item.turno || "—"}
                        </span>
                    </td>

                      <td className="fb-td-cfc">{item.cfcNome || "—"}</td>

                      <td>
                        <div className="fb-td-dt">
                          <span className="fb-date">
                            <span className="fb-local-badge">
                          {fmtDate(item.dataInicio)}
                        </span></span>
                        </div>
                      </td>
                      <td>
                        <span className="fb-local-badge">
                          {item.servicoDescricao || "—"}
                        </span>
                      </td>
                      <td>
                        <a className="fb-local-badge">
                          {item.situacao || "—"}
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!situacaoLoading && situacaoData.length === 0 && !situacaoErro && (
        <div className="fb-empty">
          <i className="fas fa-th"></i>
          <p>Selecione um período e clique em Buscar.</p>
        </div>
      )}
    </div>
  );
};

export default Grades;