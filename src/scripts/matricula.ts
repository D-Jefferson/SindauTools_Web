// src/components/Ferramentas/useMatricula.ts
import { useState } from "react";
import { exportToCSV } from "../utils/csvExport";

interface Matricula {
  _id: string;
  operacao: string;
  data_hora: string;
  matricula: {
    uuid: string;
    candidato: { nome: string; cpf: string };
    detran: { renach: string; situacao: string; servicoCodigo: string };
  };
  cfc: { cnpj: string };
}

export function useMatricula() {
  const [resultados, setResultados] = useState<Matricula[]>([]);

  const formatar = (texto: string) => {
    const linhas = texto.trim().split("\n");
    const novos: Matricula[] = [];

    linhas.forEach((linha) => {
      const el = linha.split("\t");
      if (el.length === 10) {
        novos.push({
          _id: el[0],
          operacao: el[1],
          data_hora: el[2],
          matricula: {
            uuid: el[3],
            candidato: { nome: el[4], cpf: el[5] },
            detran: { renach: el[6], situacao: el[7], servicoCodigo: el[8] },
          },
          cfc: { cnpj: el[9] },
        });
      }
    });

    setResultados(novos);
  };

  const exportar = () => {
    const headers = [
      "_id",
      "operacao",
      "data_hora",
      "matricula_uuid",
      "candidato_nome",
      "cpf",
      "renach",
      "situacao",
      "servicoCodigo",
      "cnpj",
    ];

    const linhas = resultados.map((r) => [
      r._id,
      r.operacao,
      r.data_hora,
      r.matricula.uuid,
      r.matricula.candidato.nome,
      r.matricula.candidato.cpf,
      r.matricula.detran.renach,
      r.matricula.detran.situacao,
      r.matricula.detran.servicoCodigo,
      r.cfc.cnpj,
    ]);

    exportToCSV(headers, linhas, "matriculas.csv");
  };

  const limpar = () => setResultados([]);

  return { resultados, formatar, exportar, limpar };
}
