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
  motivoIgnorar?: (item: T) => string | null;
  erroIgnoravel?: (erro: unknown) => boolean;
  aoIgnorar?: (item: T, motivo: string) => void;
  esperar?: () => Promise<void>;
}) {
  const { signal, atualizar, aoIniciar, aoConcluir } = opcoes;
  const itens = [...opcoes.itens];
  let feitos = 0;
  for (const [indice, item] of itens.entries()) {
    if (signal.aborted) break;
    const motivo = opcoes.motivoIgnorar?.(item);
    if (motivo) {
      opcoes.aoIgnorar?.(item, motivo);
      continue;
    }
    aoIniciar(item);
    // Do not abort or retry an uncertain write. Cancellation stops the next item.
    let atualizado: T;
    try {
      atualizado = await atualizar(item);
    } catch (erro) {
      if (!opcoes.erroIgnoravel?.(erro)) throw erro;
      opcoes.aoIgnorar?.(item, erro instanceof Error ? erro.message : "Consulta inválida");
      // Still wait below: a request was sent even though no write occurred.
      atualizado = undefined as T;
    }
    if (atualizado !== undefined) aoConcluir(atualizado, ++feitos);
    if (!signal.aborted && indice < itens.length - 1) {
      if (opcoes.esperar) await opcoes.esperar();
      else await new Promise<void>((resolve) => {
        const terminar = () => {
          clearTimeout(timer);
          signal.removeEventListener("abort", terminar);
          resolve();
        };
        const timer = setTimeout(terminar, 2000);
        signal.addEventListener("abort", terminar, { once: true });
        if (signal.aborted) terminar();
      });
    }
  }
  return { feitos, cancelado: signal.aborted };
}

