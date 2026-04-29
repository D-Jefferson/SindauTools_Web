import { getToken } from "./autenticacao";

export async function buscarFotobiometria(dataInicio: string, dataFim: string, idLocal: number): Promise<any[]> {
  const token = getToken();
  const base = import.meta.env.VITE_API_SINDAUTO;
  const url = `${base}/gestao/api/v1/fotobiometria?pageNumber=1&pageSize=200&idLocal=${idLocal}&dataInicio=${dataInicio}&dataFim=${dataFim}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);

  const raw = await res.json();
  const dados: any[] = Array.isArray(raw)
    ? raw
    : raw.items ?? raw.data ?? raw.result ?? raw.registros ?? [];

  dados.sort(
    (a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime()
  );

  return dados;
}