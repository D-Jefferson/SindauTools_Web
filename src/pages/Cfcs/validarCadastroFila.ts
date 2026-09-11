import type { Cfc } from "../../api/Sindauto/cfcs";

// Match the API client's local validation, before any request is sent.
export function motivoIgnorarCfc(cfc: Cfc): string | null {
  if (!/^\d{14}$/.test(String(cfc.cnpj ?? "").replace(/\D/g, ""))) return "CNPJ ausente ou inválido";
  if (!Number.isInteger(cfc.id)) return "ID inválido";
  return null;
}
