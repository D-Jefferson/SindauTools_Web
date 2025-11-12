import { getToken } from "../utils/tokenManager";
import { toast } from "react-toastify";


const BASE_URL = "https://teleaulaapi-prod.renova.app.br/api";

async function apiFetch(endpoint: string, options: RequestInit) {
  const token = getToken();

  if (!token) {
    toast.warn("Token não encontrado. Autentique-se antes de continuar.");
    throw new Error("Token não encontrado. Autentique-se antes de continuar.");
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[API] Erro ${response.status}:`, errorText);
    toast.error(`Erro na requisição: ${response.status}`);
    throw new Error(`Erro ${response.status}: ${errorText}`);
  }

  if (response.status === 204) return {};

  return response.json();
}

export const Api = {
  getMatriculaByCpf: (cpf: string) =>
    apiFetch(`/Matricula/BuscarMatricula?cpf=${cpf}`, { method: "GET" }),

  enviarNotificacaoFinanceira: (data: any) =>
    apiFetch("/Notificacao/Financeiro", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};
