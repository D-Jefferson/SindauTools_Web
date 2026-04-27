export const rawCpf = (v: string) => v.replace(/\D/g, "");

export const fmtCpf = (v: string) => {
  const r = v.replace(/\D/g, "");
  if (r.length > 9) return `${r.slice(0, 3)}.${r.slice(3, 6)}.${r.slice(6, 9)}-${r.slice(9, 11)}`;
  if (r.length > 6) return `${r.slice(0, 3)}.${r.slice(3, 6)}.${r.slice(6)}`;
  if (r.length > 3) return `${r.slice(0, 3)}.${r.slice(3)}`;
  return r;
};

export const fmtDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString("pt-BR") : "—";

export const fmtDateTime = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

export const fmtTime = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    : "—";

export const fmtMoney = (v?: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v ?? 0);

export const iniciais = (nome: string) => {
  const p = nome.trim().split(" ").filter(Boolean);
  return p.length === 1 ? p[0][0] : `${p[0][0]}${p[p.length - 1][0]}`;
};

export const toISOWithOffset = (iso?: string) =>
  iso ? new Date(iso).toISOString().replace("Z", "-0300") : "";