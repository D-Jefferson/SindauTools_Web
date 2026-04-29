import React, { useState } from "react";
import { fmtTime } from "../utils/formatos";
import { CandidatoAgendamento } from "../api/Sindauto/types";
import "../pages/Home/home.css";

export function AgendamentoCard({
  agendamento,
  expandido,
  onToggle,
}: {
  agendamento: CandidatoAgendamento;
  expandido: boolean;
  onToggle: () => void;
}) {
  const a = agendamento;

  const dataObj = a.agendamentoAgenda
    ? new Date(a.agendamentoAgenda)
    : null;

  const [presenca, setPresenca] = useState<
    "Presente" | "Ausente" | null
  >(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("agend_presenca") || "{}"
      );
      return saved[a.agendamentoId] ?? null;
    } catch {
      return null;
    }
  });

  const salvar = (status: "Presente" | "Ausente") => {
    const novo = status === presenca ? null : status;
    setPresenca(novo);

    const saved = JSON.parse(
      localStorage.getItem("agend_presenca") || "{}"
    );

    if (novo === null) delete saved[a.agendamentoId];
    else saved[a.agendamentoId] = novo;

    localStorage.setItem("agend_presenca", JSON.stringify(saved));
  };

  return (
    <div className={`cc-agend-item ${expandido ? "open" : ""}`}>
      <div onClick={onToggle}>
        <strong>{fmtTime(a.agendamentoAgenda)}</strong>
      </div>

      <div>
        <button onClick={() => salvar("Presente")}>✔</button>
        <button onClick={() => salvar("Ausente")}>✖</button>
      </div>

      {expandido && (
        <div>
          {a.agendamentoAulas.map((au: any) => (
            <div key={au.id}>
              Aula {au.numeroAula} - {au.cursoDescricao}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}