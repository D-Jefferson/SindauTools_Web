const API_TELEAULA = (import.meta as any).env.VITE_API_TELEAULA;

export async function autenticarTeleaula(acessToken: string): Promise<string> {
  const res = await fetch(`${API_TELEAULA}/api/Auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ acessToken }),
  });
  if (!res.ok) throw new Error("Falha na autenticação TeleaulaAPI");
const respostaTexto = await res.text(); 
  return respostaTexto;
}