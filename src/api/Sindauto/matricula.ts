import type {
  Matricula,
  Contrato,
  CandidatoAgendamento,
  LancamentoFinanceiro,
  ResultadoConsulta,
} from "./types";

const BASE = import.meta.env.VITE_API_SINDAUTO;
const TOKEN_KEY = "sindau_token";

// ─── TOKEN (localStorage para sobreviver à navegação) ─────────────────────────

export const setToken   = (t: string) => localStorage.setItem(TOKEN_KEY, t);
export const getToken   = ()          => localStorage.getItem(TOKEN_KEY) ?? "";
export const clearToken = ()          => localStorage.removeItem(TOKEN_KEY);

// ─── FETCH HELPER ─────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {"Content-Type": "application/json",};
  if (token) {headers["Authorization"] = `Bearer ${token}`;}

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { message?: string; error?: string }).message ??
      (body as { message?: string; error?: string }).error ??
      `HTTP ${res.status}`
    );
  }

  return res.json() as Promise<T>;
}

// ─── MATRÍCULA ────────────────────────────────────────────────────────────────

export async function buscarMatricula(cpf: string): Promise<Matricula> {
  const data = await apiFetch<
    Matricula | Matricula[] | { data?: Matricula[]; items?: Matricula[] }
  >(
    `/gestao/api/v1/matriculas/detalhes?pageNumber=1&pageSize=5&orderbyField=dataCadastro&orderByType=desc&cpf=${cpf}`
  );

  if (Array.isArray(data) && data.length > 0)                                    return data[0];
  if ("id" in data)                                                               return data as Matricula;
  if ("data"  in data && Array.isArray(data.data)  && data.data!.length  > 0)    return data.data![0];
  if ("items" in data && Array.isArray(data.items) && data.items!.length > 0)    return data.items![0];

  throw new Error("Nenhuma matrícula encontrada para este CPF.");
}

// ─── FINANCEIRO ───────────────────────────────────────────────────────────────

export async function buscarLancamentos(
  cnpj: string,
  matriculaId: number
): Promise<LancamentoFinanceiro[]> {
  const data = await apiFetch<Contrato | Contrato[]>(
    `/financeiro/api/v1/contratos?cnpj=${cnpj}&matriculaId=${matriculaId}`
  );

  const contratos: Contrato[] = Array.isArray(data) ? data : [data];
  
  return contratos.flatMap((c) => {
    const lancamentos = c.lancamentosFinanceiros ?? [];
    return lancamentos.map((lancamento) => ({
      ...lancamento,
      boleto: c.boleto
    }));
  });
}

// ─── AGENDAMENTOS ─────────────────────────────────────────────────────────────

export async function buscarAgendamentos(
  matriculaId: number
): Promise<CandidatoAgendamento[]> {
  const data = await apiFetch<
    CandidatoAgendamento[] | { data?: CandidatoAgendamento[] }
  >(
    `/agendamento/api/v1/candidatoagendamento?matriculaIdExterno=${matriculaId}`
  );

  if (Array.isArray(data))                                return data;
  if ("data" in data && Array.isArray(data.data))         return data.data!;
  return [];
}

// ─── CONSULTA CONSOLIDADA ─────────────────────────────────────────────────────

export async function consultarCandidato(cpf: string): Promise<ResultadoConsulta> {
  const matricula = await buscarMatricula(cpf);

  const [lancRes, agendRes] = await Promise.allSettled([
    buscarLancamentos(matricula.cfcCnpj, matricula.id),
    buscarAgendamentos(matricula.id),
  ]);

  return {
    matricula,
    lancamentos:  lancRes.status  === "fulfilled" ? lancRes.value  : [],
    agendamentos: agendRes.status === "fulfilled" ? agendRes.value : [],
  };
}