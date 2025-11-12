// src/components/Ferramentas/useVincular.ts
import { useState } from "react";
import { exportToCSV } from "../utils/csvExport";
import { formatDateTime } from "../utils/datetime";

interface Vincular {
  _id: string;
  operacao: string;
  data_hora: string;
  agendamento: { uuid: string };
  candidato: { cpf: string };
}

export function useVincular() {
  const [resultados, setResultados] = useState<Vincular[]>([]);

  const formatar = (texto: string, cpf: string) => {
    const uuids = texto
      .trim()
      .split("\n")
      .map((u) => u.trim())
      .filter((u) => u !== "");

    const novos = uuids.map((uuid) => ({
      _id: uuid,
      operacao: "VINCULADO",
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

    exportToCSV(headers, linhas, "vinculados.csv");
  };

  const limpar = () => setResultados([]);

  return { resultados, formatar, exportar, limpar };
}
