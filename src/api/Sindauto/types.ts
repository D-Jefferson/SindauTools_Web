// ─── Autenticação ────────────────────────────────────────────────────────────────────

export interface AuthPayload {
  username: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
  accessToken?: string;
  access_token?: string;
  jwt?: string;
  data?: { token?: string };
}


// ─── MATRÍCULA ───────────────────────────────────────────────────────────────

export interface Matricula {
  id: number;
  uuid: string;
  status: string;
  ativo: boolean;
  dataCadastro: string;
  cfcNome: string;
  cfcNomeFantasia: string;
  cfcCnpj: string;
  candidatoNome: string;
  candidatoCpf: string;
  processoRenach: string;
  processoSituacao: string;
  processoAtivo: boolean;
  servicoNome: string;
  categoriaCnhCategoria: string;
  projeto: string;
}

// ─── FINANCEIRO ──────────────────────────────────────────────────────────────

export interface FormaPagamento {
  id: number;
  descricao: string;
  label: string;
}

export interface ModoPagamento {
  id: number;
  formaPagamento: FormaPagamento;
}

export interface LancamentoFinanceiro {
  id: number;
  contratoId: number;
  valor: number;
  valorPago: number;
  valorTitulo: number;
  descricao: string;
  status: string;
  statusIntegracao: string;
  parcela: number;
  dataEmissao: string;
  dataPagamento: string;
  dataVencimento: string;
  dataBaixa: string;
  boletoId: string | null;
  modoPagamento?: ModoPagamento;
  boleto?: string;
}

export interface Contrato {
  id: number;
  matriculaId: number;
  descricao: string;
  valorGlobal: number;
  valorLiquido: number;
  parcelas: number;
  situacaoContrato: string;
  boleto: string | null;
  lancamentosFinanceiros: LancamentoFinanceiro[];
}

// ─── AGENDAMENTO ─────────────────────────────────────────────────────────────

export interface Aula {
  id: number;
  numeroAula: number;
  cursoDescricao: string;
  inicio: string;
  fim: string;
  agendamentoInstrutorNome: string;
  agendamentoCfcNome: string;
  agendamentoLimiteParticipantes: string;
  agendamentoQuantidadeParticipantesAgendados: string;
}

export interface CandidatoAgendamento {
  id: number;
  matriculaId: number;
  candidatoNome: string;
  candidatoCpf: string;
  agendamentoId: number;
  agendamentoSituacao: string;
  agendamentoAgenda: string;
  agendamentoAgendaFim: string;
  agendamentoInstrutorNome: string;
  agendamentoInstrutorCpf: string;
  agendamentoGradeId: number;
  agendamentoGradeDescricao: string;
  agendamentoServicoDescricao: string;
  agendamentoTurno: string;
  agendamentoModelo: string;
  agendamentoTipoAgendamentoDescricao: string;
  agendamentoAulas: Aula[];
  presente: boolean | null;
}

// ─── RESULTADO CONSOLIDADO ───────────────────────────────────────────────────

export interface ResultadoConsulta {
  matricula: Matricula;
  lancamentos: LancamentoFinanceiro[];
  agendamentos: CandidatoAgendamento[];
}