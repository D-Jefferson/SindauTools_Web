import type {AuthPayload, AuthResponse} from "./types";

const BASE = (import.meta as any).env.VITE_API_SINDAUTO;
const TOKEN_KEY = "sindau_token";

// ─── TOKEN (localStorage para sobreviver à navegação) ─────────────────────────

export const setToken   = (t: string) => localStorage.setItem(TOKEN_KEY, t);
export const getToken   = ()          => localStorage.getItem(TOKEN_KEY) ?? "";
export const clearToken = ()          => localStorage.removeItem(TOKEN_KEY);

// ─── AUTH ─────────────────────────────────────────────────────────────────────

export async function login(payload: AuthPayload): Promise<string> {
  const res = await fetch(`${BASE}/gestao/api/v2/autenticacao`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { message?: string }).message ?? `Falha na autenticação (${res.status})`
    );
  }
  const data = await res.json() as AuthResponse;
  console.log("[SindauTools] Auth response:", data);
  const token =
    data.token        ??
    data.accessToken  ??
    data.access_token ??
    data.jwt          ??
    data.data?.token  ??
    "";

  if (!token) {
    console.error("[SindauTools] Campos recebidos:", Object.keys(data));
    throw new Error("Token não encontrado na resposta. Veja o console para detalhes.");
  }

  return token;
}