import { useEffect, useRef, useState } from "react";
import { atualizarUmCfc, type Cfc } from "../../api/Sindauto/cfcs";
import { adquirirAtualizacao, executarFila } from "./filaCfcs";

export default function AtualizarCfcsModal({ dados, disabled, onAtualizado, onExecutando }: {
  dados: Cfc[]; disabled: boolean; onAtualizado: (cfc: Cfc) => void; onExecutando: (valor: boolean) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const cancelar = useRef<AbortController | null>(null);
  const montado = useRef(false);
  const [erroInicio, setErroInicio] = useState("");
  const trava = useRef(false);
  const [executando, setExecutando] = useState(false);
  const [cancelando, setCancelando] = useState(false);
  const [estado, setEstado] = useState({ total: 0, feitos: 0, atual: "", mensagem: "" });
  useEffect(() => {
    montado.current = true;
    return () => { montado.current = false; cancelar.current?.abort(); };
  }, []);
  useEffect(() => { if (disabled) cancelar.current?.abort(); }, [disabled]);
  function parar() { cancelar.current?.abort(); setCancelando(true); }
  async function iniciar() {
    if (trava.current || disabled || !dados.length) return;
    const liberar = adquirirAtualizacao();
    if (!liberar) { setErroInicio("Uma atualização anterior ainda está terminando. Aguarde antes de iniciar outra."); return; }
    setErroInicio("");
    trava.current = true;
    const controller = new AbortController();
    cancelar.current = controller;
    setCancelando(false);
    setExecutando(true);
    onExecutando(true);
    const fila = [...dados];
    let feitos = 0;
    let mensagem = "";
    setEstado({ total: fila.length, feitos, atual: "", mensagem: "" });
    try {
      dialog.current?.showModal();
      await executarFila({ itens: fila, signal: controller.signal, atualizar: atualizarUmCfc,
        aoIniciar: (cfc) => { if (montado.current) setEstado({ total: fila.length, feitos, atual: (cfc.nomeFantasia || cfc.nome || "CFC") + " — " + cfc.cnpj, mensagem: "" }); },
        aoConcluir: (atualizado, quantidade) => {
          feitos = quantidade;
          if (montado.current) { onAtualizado(atualizado); setEstado((valor) => ({ ...valor, feitos })); }
        },
      });
      mensagem = controller.signal.aborted ? "Cancelado. As alterações já concluídas foram mantidas." : "Atualização concluída.";
    } catch (e: unknown) {
      mensagem = "Fila interrompida: " + (e instanceof Error ? e.message : "Erro inesperado.") + " Nenhum próximo CFC será iniciado. Confira o cadastro e recarregue a lista antes de tentar novamente.";
    } finally {
      if (montado.current) {
        setEstado((valor) => ({ ...valor, feitos, mensagem }));
        setExecutando(false);
        onExecutando(false);
      }
      liberar();
      trava.current = false;
    }
  }
  return <>
    <button className="fb-btn-buscar" disabled={disabled || executando || !dados.length} onClick={iniciar}>
      Atualizar todos os CFCs carregados ({dados.length})
    </button>
    {erroInicio && <p role="alert">{erroInicio}</p>}

    <dialog ref={dialog} aria-labelledby="atualizar-cfcs-titulo" aria-describedby="atualizar-cfcs-descricao"
      onCancel={(e) => { if (executando) { e.preventDefault(); parar(); } }}
      style={{ margin: "auto", padding: "2rem", width: "min(520px, 92vw)", borderRadius: 16, border: "1px solid var(--border-color)", background: "var(--surface-color)", color: "var(--text-primary)" }}>
      <h2 id="atualizar-cfcs-titulo">Atualizando CFCs</h2>
      <p id="atualizar-cfcs-descricao" style={{ margin: "1rem 0" }}>Um CFC por vez, com intervalo de 5 segundos após cada cadastro, antes de iniciar o próximo. Escopo: página 1, até 500 CFCs carregados, independentemente da busca.</p>
      <progress aria-label="CFCs atualizados" value={estado.feitos} max={estado.total || 1} style={{ width: "100%" }} />
      <div role="status" aria-live="polite">
        <p>{estado.feitos} de {estado.total} atualizados · {estado.total - estado.feitos} restantes</p>
        <p style={{ margin: "1rem 0", overflowWrap: "anywhere" }}>{estado.atual && `${executando ? "CFC atual" : "Último CFC processado"}: ${estado.atual}`}</p>
        <p>{estado.mensagem || (cancelando ? "Cancelando: aguardando o CFC atual terminar. O próximo não será iniciado." : "Consultando o DETRAN e salvando o cadastro atual.")}</p>
      </div>
      <button autoFocus className="fb-btn-buscar" style={{ marginTop: "1.5rem" }} aria-disabled={executando && cancelando}
        onClick={() => executando ? parar() : dialog.current?.close()}>
        {executando ? (cancelando ? "Cancelando..." : "Cancelar atualização") : "Fechar"}
      </button>
    </dialog>
  </>;
}


