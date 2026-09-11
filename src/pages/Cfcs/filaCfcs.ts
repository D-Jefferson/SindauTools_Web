// Shared across page mounts: an in-flight write must finish before another run.
let ocupada = false;
export function adquirirAtualizacao() {
  if (ocupada) return null;
  ocupada = true;
  return () => { ocupada = false; };
}

export async function executarFila<T>(opcoes: {
  itens: T[];
  signal: AbortSignal;
  atualizar: (item: T) => Promise<T>;
  aoIniciar: (item: T) => void;
  aoConcluir: (item: T, feitos: number) => void;
  esperar?: () => Promise<void>;
}) {
  const { signal, atualizar, aoIniciar, aoConcluir } = opcoes;
  const itens = [...opcoes.itens];
  let feitos = 0;
  for (const item of itens) {
    if (signal.aborted) break;
    aoIniciar(item);
    // Do not abort or retry an uncertain write. Cancellation stops the next item.
    const atualizado = await atualizar(item);
    aoConcluir(atualizado, ++feitos);
    if (!signal.aborted && feitos < itens.length) {
      if (opcoes.esperar) await opcoes.esperar();
      else await new Promise<void>((resolve) => {
        const terminar = () => {
          clearTimeout(timer);
          signal.removeEventListener("abort", terminar);
          resolve();
        };
        const timer = setTimeout(terminar, 5000);
        signal.addEventListener("abort", terminar, { once: true });
        if (signal.aborted) terminar();
      });
    }
  }
  return { feitos, cancelado: signal.aborted };
}

