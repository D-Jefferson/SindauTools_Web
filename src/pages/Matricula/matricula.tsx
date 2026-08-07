import React, { useState } from "react";
import { consultarCandidato } from "../../api/Sindauto/matricula";
import { consultarRenova } from "../../api/Renova/matricula";
import "../Home/home.css";
import type { ResultadoConsulta } from "../../api/Sindauto/types";
import { rawCpf, fmtCpf, fmtDate, fmtTime, fmtMoney, fmtHml } from "../../utils/formatos";
import { useNotificacaoFinanceira } from "../../scripts/notificacao";
import { useTeleaulaToken } from "../../scripts/teleaulatoken";
import { useDemo } from "../../context/demo";
import { DEMO_MATRICULA } from "../../api/Demo/dadosficticios";
import { ModalNotificarRenova } from "../../modals/modalNotificarRenova";
import { ModalConfiguracoes } from "../../modals/configuracao";
import {
  buildNotificacaoPayload,
  buscarMatriculaRenova,
  type DadosMatriculaRenova,
} from "../../api/Teleaula/notificacao";

const statusCor = (key: string): string =>
({
  M: "verde", A: "verde", ATIVO: "verde",
  P: "vermelho", C: "vermelho", I: "vermelho",
  paid: "verde", pending: "azul",
  GERADO: "verde", PENDENTE: "azul", CRIADO: "cinza", ERRO: "vermelho",
}[key] ?? "cinza");

const statusLabel = (key: string, fallback: string): string =>
({
  M: "Matriculado", A: "Ativo", P: "Pendente", C: "Cancelado", I: "Inativo",
  paid: "Pago", pending: "Pendente",
}[key] ?? fallback);

const Badge: React.FC<{ valor: string; extra?: string }> = ({ valor, extra }) => {
  const key = extra ?? valor;
  return (
    <span className={`cc-badge cc-badge--${statusCor(key)}`}>
      {statusLabel(key, valor)}
    </span>
  );
};


const Matricula: React.FC = () => {
  const [cpfInput, setCpfInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [resultado, setResultado] = useState<ResultadoConsulta | null>(null);
  const [activeTab, setActiveTab] = useState<"geral" | "teleaulas" | "financeiro" | "renova">("geral");
  const [expandidos, setExpandidos] = useState<Record<number, boolean>>({});
  const [renova, setRenova] = useState<{ hom: string | null; fin: any; loading: boolean }>({
    hom: null,
    fin: null,
    loading: false,
  });

  const [modalNotificarAberto, setModalNotificarAberto] = useState(false);
  const [modalConfigAberto, setModalConfigAberto] = useState(false);
  const [matriculaRenova, setMatriculaRenova] = useState<{
    dados: DadosMatriculaRenova | null;
    loading: boolean;
    erro: string | null;
  }>({
    dados: null,
    loading: false,
    erro: null,
  });
  const [mostrarRawRenova, setMostrarRawRenova] = useState(false);
  const [copiadoUuid, setCopiadoUuid] = useState(false);

  const { token: teleaulaToken } = useTeleaulaToken();
  const { isDemo } = useDemo();


  const lancamentoPago = resultado?.lancamentos.find(
    (l) => l.statusIntegracao?.toLowerCase() === "paid"
  );

  const {
    estado: notifEstado,
    erro: notifErro,
    enviarRaw: enviarNotifRaw,
    resetar: resetarNotif,
  } = useNotificacaoFinanceira();

  const handleConsultarRenova = async (cpf: string) => {
    setRenova({ hom: null, fin: null, loading: true });
    try {
      const dados = await consultarRenova(cpf);
      setRenova({ ...dados, loading: false });
    } catch {
      setRenova({ hom: null, fin: null, loading: false });
    }
  };

  const handleBuscar = async () => {
    const cpf = rawCpf(cpfInput);
    if (cpf.length < 11) { setErro("CPF inválido."); return; }
    setErro("");
    setResultado(null);
    setLoading(true);
    setActiveTab("geral");
    setExpandidos({});
    setMatriculaRenova({ dados: null, loading: false, erro: null });
    setMostrarRawRenova(false);
    resetarNotif();
    try {
      if (isDemo) {
        await new Promise(r => setTimeout(r, 600));
        setResultado(DEMO_MATRICULA as any);
        return;
      } else {
        const res = await consultarCandidato(cpf);
        setResultado(res);
        handleConsultarRenova(cpf);
      }
    } catch {
      setErro("Candidato não encontrado ou erro na consulta.");
    } finally {
      setLoading(false);
    }
  };

  const m = resultado?.matricula;
  const hLabel = fmtHml(renova.hom ?? undefined);
  const hCor = statusCor(renova.hom ?? "cinza");
  const finPago = renova.fin?.situacao === "BOLETO_PAGO";

  const payloadNotificacao = m
    ? buildNotificacaoPayload({
      lancamentoId: lancamentoPago?.boletoId?.toString() ?? lancamentoPago?.id?.toString() ?? "0",
      uuidMatricula: m.uuid ?? m.id?.toString() ?? "",
      cnpj: m.cfcCnpj ?? "",
      valor: lancamentoPago?.valor ?? 0,
      dataVencimento: lancamentoPago?.dataVencimento ?? new Date().toISOString(),
      dataCriacao: lancamentoPago?.dataCadastro ?? new Date().toISOString(),
      status: lancamentoPago?.statusIntegracao ?? "A",
    })
    : null;

  const handleEnviarNotificacao = async (payload: any) => {
    await enviarNotifRaw(teleaulaToken || "", payload, () => {
      handleConsultarRenova(rawCpf(cpfInput));
    });
  };

  const handleBuscarMatriculaRenova = async () => {
    const cpf = rawCpf(cpfInput);
    setMatriculaRenova({ dados: null, loading: true, erro: null });
    try {
      const res = await buscarMatriculaRenova(teleaulaToken || "", cpf, isDemo);
      setMatriculaRenova({ dados: res, loading: false, erro: null });
    } catch (e: any) {
      setMatriculaRenova({
        dados: null,
        loading: false,
        erro: e.message || "Erro ao consultar matrícula no Renova.",
      });
    }
  };

  return (

    <div className="st-page-wrapper">
      <div className="st-main-content">

        {/* ── BUSCA ── */}
        <div className={`st-search-wrapper ${resultado ? "is-results-mode" : ""}`}>
          {!resultado && (
            <div className="st-search-titles">
              <h1>Ficha de Matrícula</h1>
              <p>Digite o CPF do candidato para carregar a ficha completa.</p>
            </div>
          )}
          <div className="st-input-group">
            <input
              type="text"
              placeholder="000.000.000-00"
              value={cpfInput}
              onChange={(e) => setCpfInput(fmtCpf(e.target.value))}
              onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
              disabled={loading}
              autoFocus
            />
            <button onClick={handleBuscar} disabled={loading}>
              {loading ? <i className="fas fa-circle-notch fa-spin" /> : "BUSCAR"}
            </button>
          </div>
          {erro && (
            <div className="st-erro-msg">
              <i className="fas fa-exclamation-circle" /> {erro}
            </div>
          )}
        </div>

        {/* ── FICHA ── */}
        {resultado && m && (
          <div className="ds-wrapper fade-in-up">

            {/* Cabeçalho */}
            <div className="ds-header">
              <div className="ds-header-block">
                <span className="ds-label">Nome Completo</span>
                <strong className="ds-value highlight">{m.candidatoNome}</strong>
              </div>
              <div className="ds-header-block">
                <span className="ds-label">RENACH</span>
                <span className="ds-value">{m.processoRenach || "SEM RENACH"}</span>
              </div>
              <div className="ds-header-block">
                <span className="ds-label">Serviço</span>
                <strong className="ds-value">{m.servicoNome || "—"}</strong>
              </div>
              <div className="ds-header-block">
                <span className="ds-label">CFC Vinculado</span>
                <strong className="ds-value">{m.cfcNomeFantasia || m.cfcNome || "—"}</strong>
              </div>
              <div className="ds-header-block">
                <span className="ds-label">CNPJ CFC</span>
                <strong className="ds-value">{m.cfcCnpj || "—"}</strong>
              </div>
            </div>

            {/* ── TABS ── */}
            <div className="ds-tabs">
              <button
                className={`ds-tab ${activeTab === "geral" ? "active" : ""}`}
                onClick={() => setActiveTab("geral")}
              >
                Dados do Processo
              </button>
              <button
                className={`ds-tab ${activeTab === "teleaulas" ? "active" : ""}`}
                onClick={() => setActiveTab("teleaulas")}
              >
                Curso Teórico ({resultado.agendamentos.length})
              </button>
              <button
                className={`ds-tab ${activeTab === "financeiro" ? "active" : ""}`}
                onClick={() => setActiveTab("financeiro")}
              >
                Financeiro ({resultado.lancamentos.length})
              </button>
              <button
                className={`ds-tab ${activeTab === "renova" ? "active" : ""}`}
                onClick={() => setActiveTab("renova")}
              >
                Renova Portal
              </button>
            </div>

            {/* ── BODY ── */}
            <div className="ds-body">

              {/* SIDEBAR */}
              <div className="ds-sidebar">
                <div className="ds-photo-box">
                  <i className="fas fa-user" />
                </div>
                <div className="ds-actions-group">
                  <div className="ds-field-value">
                    <label>Situação: </label>
                    <Badge valor={m.status} />
                  </div>
                  <div className="ds-field-value">
                    <label>CPF: </label>
                    {fmtCpf(m.candidatoCpf)}
                  </div>
                  <div className="ds-field-value">
                    <label>Data Cadastro: </label>
                    {fmtDate(m.dataCadastro)}
                  </div>
                  <div className="ds-divider" />
                  <button className="ds-btn danger">
                    <i className="fas fa-times-circle" /> Cancelar Matrícula
                  </button>
                </div>
              </div>

              {/* CONTEÚDO PRINCIPAL */}
              <div className="ds-main-content">

                {/* ── ABA: DADOS GERAIS ── */}
                {activeTab === "geral" && (
                  <>
                    <h3 className="ds-section-title mt-2">
                      <i className="fas fa-plug" /> Status das Integrações
                    </h3>
                    <div className="ds-timeline">

                      <div className="ds-tl-item">
                        <div className={`ds-tl-dot ${hCor}`} />
                        <div className="ds-tl-content">
                          <div className="ds-tl-header">
                            <strong>Homologação Portal BA</strong>
                            <span>{renova.loading ? "Consultando..." : "Atualizado agora"}</span>
                          </div>
                          <p>{renova.loading ? "Buscando status no Renova..." : `Status atual: ${hLabel}`}</p>
                        </div>
                      </div>

                      <div className="ds-tl-item">
                        <div className={`ds-tl-dot ${resultado.agendamentos.length > 0 ? "verde" : "cinza"}`} />
                        <div className="ds-tl-content">
                          <div className="ds-tl-header">
                            <strong>Situação Teórica</strong>
                            <span>Sistema Interno</span>
                          </div>
                          <p>
                            {resultado.agendamentos.length > 0
                              ? `Candidato vinculado a ${resultado.agendamentos.length} agendamento(s).`
                              : "Candidato aguardando agendamento de aulas."}
                          </p>
                        </div>
                      </div>

                      <div className="ds-tl-item">
                        <div className={`ds-tl-dot ${finPago ? "verde" : renova.loading ? "azul" : "vermelho"}`} />
                        <div className="ds-tl-content">
                          <div className="ds-tl-header">
                            <strong>Notificação Financeira (Renova)</strong>
                            <span>{renova.loading ? "Consultando..." : finPago ? "Homologado" : "Pendente"}</span>
                          </div>
                          <p>
                            {renova.loading
                              ? "Buscando status financeiro no Renova..."
                              : finPago
                                ? "Boleto pago e homologado no Renova."
                                : "Sem pagamento homologado no Renova."}
                          </p>
                        </div>
                      </div>

                      <div className="ds-tl-item">
                        <div className={`ds-tl-dot ${lancamentoPago || finPago ? "verde" : "vermelho"}`} />
                        <div className="ds-tl-content">
                          <div className="ds-tl-header">
                            <strong>Situação Financeira (Sindauto)</strong>
                            <span>{loading ? "Consultando..." : "Atualizado agora"}</span>
                          </div>
                          <p>
                            {resultado.lancamentos.length === 0
                              ? finPago
                                ? "Pago na Renova"
                                : "Nenhum boleto encontrado."
                              : `${resultado.lancamentos.length} lançamento(s) — Teleaula: ${lancamentoPago
                                ? "Pago"
                                : finPago
                                  ? "Pago na Renova"
                                  : "Não Pago"
                              }`}
                          </p>
                        </div>
                      </div>

                    </div>
                  </>
                )}

                {/* ── ABA: CURSO TEÓRICO ── */}
                {activeTab === "teleaulas" && (
                  <div className="teleaulas-container">
                    <div className="ds-section-info">
                      <span>
                        Candidato vinculado a <strong>{resultado.agendamentos.length}</strong> período(s) de aula.
                      </span>
                      <button
                        className="btn-remover-grade-inline"
                        onClick={() => {
                          if (window.confirm("Remover candidato da grade?")) console.log("remover da grade");
                        }}
                      >
                        <i className="fas fa-trash" /> Remover da Grade
                      </button>
                    </div>

                    {resultado.agendamentos.length === 0 ? (
                      <p className="ds-empty">Nenhum agendamento encontrado.</p>
                    ) : (
                      resultado.agendamentos.map((a) => {
                        const dataObj = a.agendamentoAgenda ? new Date(a.agendamentoAgenda) : null;
                        return (
                          <div className="cc-agend-item modern" key={a.id}>
                            <div className="cc-agend-grade-bar">
                              <span className="cc-agend-grade-label">
                                <i className="fas fa-th-large" /> GRADE #{a.agendamentoGradeId}
                              </span>
                            </div>
                            <div
                              className="cc-agend-header"
                              onClick={() =>
                                setExpandidos((p) => ({
                                  ...p,
                                  [a.agendamentoId ?? a.id]: !p[a.agendamentoId ?? a.id],
                                }))
                              }
                            >
                              <div className="cc-date-block">
                                <span className="cc-date-day">
                                  {dataObj?.getDate().toString().padStart(2, "0") ?? "—"}
                                </span>
                                <span className="cc-date-mon">
                                  {dataObj?.toLocaleDateString("pt-BR", { month: "short" }) ?? ""}
                                </span>
                              </div>
                              <div className="cc-agend-info">
                                <div className="cc-agend-title-row">
                                  <span className="grade-badge">ID AGEND: {a.agendamentoId ?? a.id}</span>
                                  <div className="cc-agend-hora">
                                    {fmtTime(a.agendamentoAgenda)} – {fmtTime(a.agendamentoAgendaFim)}
                                  </div>
                                </div>
                                <div className="cc-agend-meta">
                                  <span><i className="fas fa-chalkboard-teacher" /> {a.agendamentoInstrutorNome || "—"}</span>
                                  <span><i className="fas fa-info-circle" /> {a.agendamentoGradeDescricao || "—"}</span>
                                  {a.agendamentoSituacao && <Badge valor={a.agendamentoSituacao} />}
                                </div>
                              </div>
                              <div className="cc-agend-actions">
                                <i
                                  className={`fas fa-chevron-down cc-chevron ${expandidos[a.agendamentoId ?? a.id] ? "aberto" : ""
                                    }`}
                                />
                              </div>
                            </div>

                            {expandidos[a.agendamentoId ?? a.id] && a.agendamentoAulas?.length > 0 && (
                              <div className="cc-aulas-lista">
                                {a.agendamentoAulas.map((au: any) => (
                                  <div className="cc-aula-row" key={au.id}>
                                    <span className="aula-badge">Aula {au.numeroAula}</span>
                                    <div className="cc-aula-desc">{au.cursoDescricao}</div>
                                    <div className="cc-aula-time">
                                      {fmtTime(au.inicio)} às {fmtTime(au.fim)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

                {/* ── ABA: FINANCEIRO ── */}
                {activeTab === "financeiro" && (
                  <div className="list-container">
                    {resultado.lancamentos.length === 0 ? (
                      <p className="ds-empty">Nenhum lançamento financeiro encontrado.</p>
                    ) : (
                      resultado.lancamentos.map((l) => (
                        <div className="cc-lanc-item" key={l.id}>
                          <div className="cc-lanc-top">
                            <div className="cc-lanc-icon">
                              <i className="fas fa-file-invoice-dollar" />
                            </div>
                            <div className="cc-lanc-info">
                              <div className="cc-lanc-desc">
                                {l.descricao || "—"}
                                <Badge valor={l.status} extra={l.statusIntegracao ?? l.status} />
                              </div>
                              <div className="cc-lanc-meta">
                                <span><i className="fas fa-hashtag" /> ID {l.id}</span>
                                <span><i className="fas fa-layer-group" /> Parcela {l.parcela || 1}</span>
                                <span><i className="fas fa-calendar-day" /> Venc: {fmtDate(l.dataVencimento)}</span>
                                {l.dataPagamento && (
                                  <span><i className="fas fa-check" /> Pago: {fmtDate(l.dataPagamento)}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="cc-lanc-valor-row">
                            <div>
                              <div className="cc-lanc-total">{fmtMoney(l.valor)}</div>
                              <div className="cc-lanc-pago" />
                            </div>
                            {(l as any).boleto && (
                              <a
                                href={(l as any).boleto}
                                target="_blank"
                                rel="noreferrer"
                                className="cc-link-btn cc-link-btn--green"
                              >
                                <i className="fas fa-file-pdf" /> Ver Boleto
                              </a>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* ── ABA: RENOVA ── */}
                {activeTab === "renova" && (
                  <div className="renova-panel">
                    <h3 className="ds-section-title">
                      <i className="fas fa-satellite-dish" /> Status e Ações Renova
                    </h3>

                    {/* Status Cards */}
                    <div className="renova-status-grid">
                      <div className={`renova-status-card ${hCor}`}>
                        <label>Status do Curso</label>
                        <strong>{renova.loading ? "Carregando..." : hLabel}</strong>
                        <p>Status atual da homologação no Portal BA</p>
                      </div>
                      <div className={`renova-status-card ${finPago ? "verde" : "vermelho"}`}>
                        <label>Notificação Financeira</label>
                        <strong>{renova.loading ? "Carregando..." : renova.fin?.situacao || "Sem informação"}</strong>
                        <p>{finPago ? "Boleto pago e homologado." : "Sem pagamento homologado."}</p>
                      </div>
                    </div>

                    {/* Barra de Ações com os 2 botões */}
                    <div className="renova-actions-bar">
                      <button
                        className="ds-btn-action primary"
                        title={
                          !lancamentoPago
                            ? "O boleto precisa estar pago no Sindauto para notificar"
                            : finPago
                              ? "Pagamento já consta no Renova"
                              : "Revisar JSON e notificar Renova"
                        }
                        onClick={() => {
                          resetarNotif();
                          setModalNotificarAberto(true);
                        }}
                      >
                        <i className="fas fa-paper-plane" />
                        Notificar Renova
                      </button>

                      <button
                        className="ds-btn-action secondary"
                        onClick={handleBuscarMatriculaRenova}
                        disabled={matriculaRenova.loading}
                      >
                        {matriculaRenova.loading ? (
                          <>
                            <i className="fas fa-circle-notch fa-spin" /> Buscando Matrícula...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-id-card" /> Buscar Matrícula Renova
                          </>
                        )}
                      </button>
                    </div>

                    {/* Feedback de erro ao buscar matrícula */}
                    {matriculaRenova.erro && (
                      <div className="st-erro-msg" style={{ margin: "1rem 0", textAlign: "left" }}>
                        <i className="fas fa-exclamation-triangle" /> {matriculaRenova.erro}
                      </div>
                    )}

                    {/* Card de Apresentação dos Dados da Matrícula Renova */}
                    {matriculaRenova.dados && (
                      <div className="renova-matricula-card">
                        <div className="renova-matricula-header">
                          <h4>
                            <i className="fas fa-user-check" style={{ color: "var(--brand-red)" }} />
                            Dados da Matrícula no Renova
                          </h4>
                          <span
                            className={`cc-badge cc-badge--${matriculaRenova.dados.isDeleted === 0 ? "verde" : "vermelho"
                              }`}
                          >
                            {matriculaRenova.dados.isDeleted === 0
                              ? "Ativo (isDeleted: 0)"
                              : `isDeleted: ${matriculaRenova.dados.isDeleted}`}
                          </span>
                        </div>

                        <div className="renova-matricula-grid">
                          <div className="renova-matricula-item">
                            <label>Número do Processo</label>
                            <strong>{matriculaRenova.dados.numero_processo || "—"}</strong>
                          </div>

                          <div className="renova-matricula-item">
                            <label>Nome do Candidato</label>
                            <strong>{matriculaRenova.dados.nome || "—"}</strong>
                          </div>

                          <div className="renova-matricula-item">
                            <label>CPF</label>
                            <strong>{fmtCpf(matriculaRenova.dados.cpf)}</strong>
                          </div>

                          <div className="renova-matricula-item">
                            <label>UUID Matrícula</label>
                            <div
                              className="renova-copyable"
                              title="Clique para copiar UUID"
                              onClick={() => {
                                if (matriculaRenova.dados?.uuid) {
                                  navigator.clipboard.writeText(matriculaRenova.dados.uuid);
                                  setCopiadoUuid(true);
                                  setTimeout(() => setCopiadoUuid(false), 2000);
                                }
                              }}
                            >
                              <span>{matriculaRenova.dados.uuid || "—"}</span>
                              <i className={`fas ${copiadoUuid ? "fa-check" : "fa-copy"}`} />
                            </div>
                          </div>

                          <div className="renova-matricula-item">
                            <label>Status Deleção (isDeleted)</label>
                            <strong>
                              {matriculaRenova.dados.isDeleted !== undefined
                                ? String(matriculaRenova.dados.isDeleted)
                                : "—"}
                            </strong>
                          </div>
                        </div>

                        <div>
                          <button
                            type="button"
                            className="renova-raw-toggle"
                            onClick={() => setMostrarRawRenova(!mostrarRawRenova)}
                          >
                            <i className="fas fa-code" />
                            {mostrarRawRenova ? "Ocultar JSON bruto" : "Ver JSON bruto da resposta"}
                          </button>

                          {mostrarRawRenova && (
                            <pre className="renova-raw-json-box">
                              {JSON.stringify(matriculaRenova.dados, null, 2)}
                            </pre>
                          )}
                        </div>
                      </div>
                    )}

                  </div>
                )}

              </div>
            </div>

            {/* Modal de Notificação Renova com editor JSON */}
            <ModalNotificarRenova
              aberto={modalNotificarAberto}
              onFechar={() => {
                setModalNotificarAberto(false);
                resetarNotif();
              }}
              payloadInicial={payloadNotificacao}
              onEnviar={handleEnviarNotificacao}
              loading={notifEstado === "loading"}
              erro={notifErro}
              sucesso={notifEstado === "success"}
              temToken={Boolean(teleaulaToken && teleaulaToken.trim())}
              onAbrirConfigToken={() => setModalConfigAberto(true)}
            />

            {/* Modal de Configurações de Token (caso precise configurar direto do aviso) */}
            <ModalConfiguracoes
              aberto={modalConfigAberto}
              onFechar={() => setModalConfigAberto(false)}
            />

          </div>
        )}

      </div>
    </div>
  );
};

export default Matricula;