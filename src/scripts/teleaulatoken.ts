import { useState } from "react";

const KEY = "teleaula_access_token";

export function useTeleaulaToken() {
  const [token, setTokenState] = useState<string>(
    () => localStorage.getItem(KEY) ?? ""
  );

  const salvar = (novoToken: string) => {
    localStorage.setItem(KEY, novoToken);
    setTokenState(novoToken);
  };

  const limpar = () => {
    localStorage.removeItem(KEY);
    setTokenState("");
  };

  return { token, salvar, limpar };
}