// src/components/Ferramentas/useDesvincular.ts
import { useState } from "react";
import { exportToCSV } from "../utils/csvExport";
import { formatDateTime } from "../utils/datetime";

interface Desvincular {
  _id: string;
  operacao: string;
  data_hora: string;
  agendamento: { uuid: string };
  candidato: { cpf: string };
}

export function useDesvincular() {
  const [resultados, setResultados] = useState<Desvincular[]>([]);

  const formatar = (texto: string, cpf: string) => {
    const uuids = texto
      .trim()
      .split("\n")
      .map((u) => u.trim())
      .filter((u) => u !== "");

    const novos = uuids.map((uuid) => ({
      _id: uuid,
      operacao: "DESVINCULADO",
      data_hora: formatDateTime(),
      agendamento: { uuid },
      candidato: { cpf },
    }));

    setResultados(novos);
  };

  const exportar = () => {
    const headers = ["_id", "operacao", "data_hora", "uuid", "cpf"];
    const linhas = resultados.map((r) => [
      r._id,
      r.operacao,
      r.data_hora,
      r.agendamento.uuid,
      r.candidato.cpf,
    ]);

    exportToCSV(headers, linhas, "desvinculados.csv");
  };

  const limpar = () => setResultados([]);

  return { resultados, formatar, exportar, limpar };
}
