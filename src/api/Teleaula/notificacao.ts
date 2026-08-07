import { autenticarTeleaula } from "./autenticacao";

const API_TELEAULA = (import.meta as any).env.VITE_API_TELEAULA;

export interface DadosNotificacao {
  lancamentoId: string;
  uuidMatricula: string;
  cnpj: string;
  valor: number | string;
  dataVencimento: string;
  dataCriacao: string;
  status: string;
}

export interface DadosMatriculaRenova {
  numero_processo: string;
  isDeleted: number;
  uuid: string;
  cpf: string;
  nome: string;
  [key: string]: any;
}

export function buildNotificacaoPayload(dados: Partial<DadosNotificacao>) {
  const uuid = dados.uuidMatricula || "";
  const now = new Date().toISOString();
  return {
    _id: uuid,
    operacao: "CADASTRO",
    data_hora: now,
    uuid_matricula: uuid,
    cnpj: dados.cnpj || "",
    financeiro: {
      situacao: "CONCLUIDO",
      numero_cobranca: dados.lancamentoId || "0",
      operadora: "EFIPAY",
      valor: typeof dados.valor === "string" ? parseFloat(dados.valor) || 0 : dados.valor ?? 0,
      data_criacao: dados.dataCriacao || now,
      data_atualizacao: dados.dataCriacao || now,
      data_vencimento: dados.dataVencimento || now,
      status_atual: dados.status || "A",
    },
  };
}

export async function enviarNotificacaoFinanceiraRaw(
  acessToken: string,
  payload: any
): Promise<any> {
  const token = await autenticarTeleaula(acessToken);

  const res = await fetch(`${API_TELEAULA}/api/Notificacao/Financeiro`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: typeof payload === "string" ? payload : JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => "");
    throw new Error(`Erro ao notificar (${res.status}): ${errorBody || res.statusText}`);
  }

  return await res.json().catch(() => ({}));
}

export async function enviarNotificacaoFinanceira(
  acessToken: string,
  dados: DadosNotificacao
): Promise<void> {
  const payload = buildNotificacaoPayload(dados);
  await enviarNotificacaoFinanceiraRaw(acessToken, payload);
}

export async function buscarMatriculaRenova(
  acessToken: string,
  cpf?: string,
  isDemo?: boolean
): Promise<DadosMatriculaRenova> {
  if (isDemo) {
    await new Promise((r) => setTimeout(r, 600));
    return {
      numero_processo: "BA713037453",
      isDeleted: 0,
      uuid: "ad0b88bb-a4bc-4b3e-b42d-04a8c0ba6af6",
      cpf: cpf || "11059348705",
      nome: "EDINILSON MOREIRA DOS SANTOS",
    };
  }

  let token = "";
  if (acessToken?.trim()) {
    try {
      token = await autenticarTeleaula(acessToken.trim());
    } catch {
      token = acessToken.trim();
    }
  }

  const url = cpf
    ? `${API_TELEAULA}/api/Matricula/BuscarMatricula?cpf=${encodeURIComponent(cpf)}`
    : `${API_TELEAULA}/api/Matricula/BuscarMatricula`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method: "GET",
    headers,
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => "");
    throw new Error(`Erro ao buscar matrícula (${res.status}): ${errorBody || res.statusText}`);
  }

  const data = await res.json();
  if (Array.isArray(data)) {
    return data[0] || null;
  }
  return data;
}