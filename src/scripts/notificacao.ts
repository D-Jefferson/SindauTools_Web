import { useState } from "react";
import {
  enviarNotificacaoFinanceira,
  enviarNotificacaoFinanceiraRaw,
  type DadosNotificacao,
} from "../api/Teleaula/notificacao";

type Estado = "idle" | "loading" | "success" | "error";

export function useNotificacaoFinanceira() {
  const [estado, setEstado] = useState<Estado>("idle");
  const [erro, setErro] = useState<string | null>(null);

  const enviar = async (
    acessToken: string,
    dados: DadosNotificacao,
    onSucesso?: () => void
  ) => {
    setEstado("loading");
    setErro(null);
    try {
      await enviarNotificacaoFinanceira(acessToken, dados);
      setEstado("success");
      onSucesso?.();
    } catch (e: any) {
      setErro(e.message ?? "Erro desconhecido");
      setEstado("error");
    }
  };

  const enviarRaw = async (
    acessToken: string,
    payload: any,
    onSucesso?: () => void
  ) => {
    setEstado("loading");
    setErro(null);
    try {
      await enviarNotificacaoFinanceiraRaw(acessToken, payload);
      setEstado("success");
      onSucesso?.();
    } catch (e: any) {
      setErro(e.message ?? "Erro desconhecido");
      setEstado("error");
    }
  };

  const resetar = () => {
    setEstado("idle");
    setErro(null);
  };

  return { estado, erro, enviar, enviarRaw, resetar };
}