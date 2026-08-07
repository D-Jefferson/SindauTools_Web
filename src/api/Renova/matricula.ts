import { renovaLogin } from "./autenticacao";

const RENOVA_BASE = import.meta.env.VITE_RENOVA_BASE;

export async function consultarRenova(cpf: string): Promise<{ hom: string | null; fin: any }> {
  const { access_token, matriculaId } = await renovaLogin(cpf);
  const headers = {
    Authorization: `Bearer ${access_token}`,
    "Content-Type": "application/json",
  };

  const [rFin, rServ] = await Promise.all([
    fetch(`${RENOVA_BASE}/agendamentoonline/api/v1/candidatosituacaofinanceira?matriculaId=${matriculaId}`, { headers }),
    fetch(`${RENOVA_BASE}/agendamentoonline/api/v1/servicocandidato?matriculaId=${matriculaId}`, { headers }),
  ]);

  let fin = null, hom = null;
  if (rFin.ok) { const d = await rFin.json(); fin = Array.isArray(d) ? d[0] : d; }
  if (rServ.ok) { const d = await rServ.json(); hom = (Array.isArray(d) ? d[0] : d)?.situacaoHomologacao ?? null; }

  return { hom, fin };
}