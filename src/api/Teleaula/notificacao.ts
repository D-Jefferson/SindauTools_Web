import { autenticarTeleaula } from "./autenticacao";

const API_TELEAULA = (import.meta as any).env.VITE_API_TELEAULA;

export interface DadosNotificacao {
  lancamentoId: string;
  uuidMatricula: string;
  cnpj: string;
  valor: Number;
  dataVencimento: string;
  dataCriacao: string;
  status: string;
}

export async function enviarNotificacaoFinanceira(
  acessToken: string,
  dados: DadosNotificacao
): Promise<void> {
  const token = await autenticarTeleaula(acessToken);

const payload = {
    _id: dados.uuidMatricula,
    operacao: "CADASTRO",
    data_hora: new Date().toISOString(),
    uuid_matricula: dados.uuidMatricula,
    cnpj: dados.cnpj,
    financeiro: {
      situacao: "CONCLUIDO",
      numero_cobranca: dados.lancamentoId,
      operadora: "EFIPAY",
      valor: dados.valor,
      data_criacao: dados.dataCriacao,
      data_atualizacao: dados.dataCriacao,
      data_vencimento: dados.dataVencimento,
      status_atual: dados.status,
    },
  };

  const res = await fetch(`${API_TELEAULA}/api/Notificacao/Financeiro`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(`Erro ao notificar: ${res.status}`);
}