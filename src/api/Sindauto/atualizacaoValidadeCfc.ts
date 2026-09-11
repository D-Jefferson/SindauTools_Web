import type { Cfc } from "./cfcs";

// The full loaded record is preserved; only the expiry comes from DETRAN.
export function montarAtualizacao(cfc: Cfc, consulta: {
  cnpj: string;
  dataValidade: string;
}): Cfc {
  const cnpj = String(cfc.cnpj ?? "").replace(/\D/g, "");
  if (!/^\d{14}$/.test(cnpj) || String(consulta?.cnpj ?? "").replace(/\D/g, "") !== cnpj) {
    throw new Error("O CNPJ retornado pelo DETRAN não corresponde ao CFC selecionado.");
  }
  if (typeof consulta.dataValidade !== "string" || !consulta.dataValidade.trim() ||
      Number.isNaN(Date.parse(consulta.dataValidade))) {
    throw new Error("A consulta DETRAN retornou vencimento inválido. Nenhuma alteração foi enviada.");
  }
  return { ...cfc, dataValidade: consulta.dataValidade };
}
