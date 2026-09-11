import { getToken } from "./autenticacao";
import { montarAtualizacao } from "./atualizacaoValidadeCfc";
export { montarAtualizacao } from "./atualizacaoValidadeCfc";

export interface Cfc {
  [key: string]: unknown;
  id: number;
  codCfcDetran?: number | null;
  nomeFantasia?: string | null;
  razaoSocial?: string | null;
  nome?: string | null;
  cnpj?: string | null;
  cidade?: string | null;
  estado?: string | null;
  dataValidade?: string | null;
  idLocalFotoBiometria?: number | null;
}
const base = () => (import.meta.env.VITE_API_SINDAUTO || "https://api-aks.sindautoba.com.br").replace(/\/$/, "");
function headers() {
  const token = getToken();
  if (!token) throw new Error("Faça login novamente para consultar os CFCs.");
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}
async function verificar(res: Response, etapa: string) {
  if (res.status === 401) throw new Error("Sua sessão expirou. Faça login novamente.");
  if (!res.ok) throw new Error(`${etapa} (HTTP ${res.status}).`);
}
export async function buscarCfcs(signal?: AbortSignal): Promise<Cfc[]> {
  const res = await fetch(`${base()}/gestao/api/v1/cfcs?pageNumber=1&pageSize=500`, { headers: headers(), signal });
  await verificar(res, "Não foi possível carregar os CFCs");
  const raw = await res.json();
  const dados = Array.isArray(raw) ? raw : raw?.items ?? raw?.data ?? raw?.result ?? raw?.registros;
  if (!Array.isArray(dados)) throw new Error("A API retornou uma lista de CFCs em formato inesperado.");
  return [...dados].sort((a, b) =>
    (a.nomeFantasia || a.razaoSocial || a.nome || "").localeCompare(b.nomeFantasia || b.razaoSocial || b.nome || "", "pt-BR")
  );
}
const digitos = (valor: unknown) => String(valor ?? "").replace(/\D/g, "");
// Intencionalmente aceita um cadastro; não existe atualização em lote.
export async function atualizarUmCfc(cfc: Cfc): Promise<Cfc> {
  const cnpj = digitos(cfc.cnpj);
  if (!/^\d{14}$/.test(cnpj) || !Number.isInteger(cfc.id)) throw new Error("Selecione um CFC com ID e CNPJ válidos.");
  const autenticacao = headers();
  const consulta = await fetch(`${base()}/gestao/api/v1/detranba/consultacfc?cnpj=${cnpj}`, { headers: autenticacao });
  await verificar(consulta, "Falha ao consultar o CFC no DETRAN");
  const payload = montarAtualizacao(cfc, await consulta.json());
  let resposta: Response;
  try {
    resposta = await fetch(`${base()}/gestao/api/v1/cfcs`, {
      method: "PUT", headers: autenticacao, body: JSON.stringify(payload),
    });
  } catch {
    throw new Error("Não foi possível confirmar o resultado do PUT. Recarregue a lista e confira o cadastro antes de repetir.");
  }
  await verificar(resposta, "O servidor não confirmou a atualização do CFC; confira o cadastro antes de repetir");
  return { ...cfc, ...payload };
}

