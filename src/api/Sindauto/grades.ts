import { getToken } from "./autenticacao";

export async function buscarGrades(dataInicio: string, dataFim: string, situacao: string): Promise<any[]> {
  const token = getToken();
  const base = import.meta.env.VITE_API_SINDAUTO;
  const situacaoParam = situacao
  ? `&situacaoGrade=${situacao}`
  : "";
  const url =`${base}/agendamento/api/v1/gradescompartilhado?pageNumber=1&pageSize=200&orderbyField=dataInicio&orderByType=desc` +situacaoParam +`&dataInicio=${dataInicio}&dataFim=${dataFim}&modelo=COMPARTILHADO`;

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