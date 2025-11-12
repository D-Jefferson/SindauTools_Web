import { useState } from "react";
import { exportToCSV } from "../utils/csvExport";
import { Api } from "../api/notificacaoApi";

interface Notificacao {
  _id: string;
  operacao: string;
  data_hora: string;
  uuid_matricula: string;
  cnpj: string;
  financeiro: {
    situacao: string;
    numero_cobranca: string;
    operadora: string;
    valor: number;
    data_criacao: string;
    data_atualizacao: string;
    data_vencimento: string;
    status_atual: string;
  };
}

export function useNotificacao() {
  const [resultados, setResultados] = useState<Notificacao[]>([]);

const formatar = (texto: string) => {
  const linhas = texto
    .trim()
    .split("\n")
    .filter((l) => l.trim().length > 0);

  const novos: Notificacao[] = [];

  linhas.forEach((linha) => {
    // 🔍 Detecta separador automaticamente
    let e: string[] = [];

    if (linha.includes("\t")) {
      e = linha.split("\t");
    } else if (linha.includes(";")) {
      e = linha.split(";");
    } else if (linha.includes(",")) {
      e = linha.split(",");
    } else {
      // separa por múltiplos espaços
      e = linha.trim().split(/\s+/);
    }

    // ✅ Corrige o caso "paid" / "New"
    if (e.length >= 13 && (e[12].toLowerCase() === "paid" || e[12].toLowerCase() === "new")) {
      novos.push({
        _id: e[0],
        operacao: e[1],
        data_hora: e[2],
        uuid_matricula: e[3],
        cnpj: e[4],
        financeiro: {
          situacao: e[5],
          numero_cobranca: e[6],
          operadora: e[7],
          valor: parseFloat(e[8].replace(",", ".")),
          data_criacao: e[9],
          data_atualizacao: e[10],
          data_vencimento: e[11],
          status_atual: e[12],
        },
      });
    } else {
      console.warn("❌ Linha ignorada (colunas detectadas:", e.length, "):", linha);
    }
  });

  console.log("✅ Novos resultados formatados:", novos);
  setResultados(novos);
};

  const enviar = async (notificacao: Notificacao) => {
    return Api.enviarNotificacaoFinanceira(notificacao);
  };

  const exportar = () => {
    const headers = [
      "_id",
      "operacao",
      "data_hora",
      "uuid_matricula",
      "cnpj",
      "situacao",
      "numero_cobranca",
      "operadora",
      "valor",
      "data_criacao",
      "data_atualizacao",
      "data_vencimento",
      "status_atual",
    ];

    const linhas = resultados.map((r) => [
      r._id,
      r.operacao,
      r.data_hora,
      r.uuid_matricula,
      r.cnpj,
      r.financeiro.situacao,
      r.financeiro.numero_cobranca,
      r.financeiro.operadora,
      r.financeiro.valor,
      r.financeiro.data_criacao,
      r.financeiro.data_atualizacao,
      r.financeiro.data_vencimento,
      r.financeiro.status_atual,
    ]);

    exportToCSV(headers, linhas, "notificacoes.csv");
  };

  const limpar = () => setResultados([]);

  return { resultados, formatar, exportar, enviar, limpar };
}
