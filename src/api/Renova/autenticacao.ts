const RENOVA_BASE = import.meta.env.VITE_RENOVA_BASE;

export async function renovaLogin(cpf: string) {
  const res = await fetch(`${RENOVA_BASE}/agendamentoonline/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: cpf, password: cpf }),
  });
  if (!res.ok) throw new Error("Falha no login Renova");
  return await res.json() as { access_token: string; matriculaId: string };
}