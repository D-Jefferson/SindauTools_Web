import { useEffect, useRef, useState } from "react";
import { atualizarUmCfc, type Cfc } from "../../api/Sindauto/cfcs";
import { adquirirAtualizacao, executarFila } from "./filaCfcs";
import { motivoIgnorarCfc } from "./validarCadastroFila";
import { ConsultaCfcInvalida } from "../../api/Sindauto/respostaConsultaCfc";

export default function AtualizarCfcsModal({ dados, disabled, onAtualizado, onExecutando }: {
  dados: Cfc[]; disabled: boolean; onAtualizado: (cfc: Cfc) => void; onExecutando: (valor: boolean) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const cancelar = useRef<AbortController | null>(null);
  const montado = useRef(false);
  const [erroInicio, setErroInicio] = useState("");
  const trava = useRef(false);
  const progresso = useRef<{ fila: Cfc[]; proximo: number; feitos: number; ignorados: string[] } | null>(null);
  const [pendentes, setPendentes] = useState(0);
  const [executando, setExecutando] = useState(false);
  const [cancelando, setCancelando] = useState(false);
  const [ignorados, setIgnorados] = useState<string[]>([]);
  const [estado, setEstado] = useState({ total: 0, feitos: 0, atual: "", mensagem: "" });
  useEffect(() => {
    montado.current = true;
    return () => { montado.current = false; cancelar.current?.abort(); };
  }, []);
  useEffect(() => { if (disabled) cancelar.current?.abort(); }, [disabled]);
  function parar() { cancelar.current?.abort(); setCancelando(true); }
  async function iniciar(continuar = false) {
    if (trava.current || disabled || !dados.length) return;
    const liberar = adquirirAtualizacao();
    if (!liberar) { setErroInicio("Uma atualização anterior ainda está terminando. Aguarde antes de iniciar outra."); return; }
    setErroInicio("");
    trava.current = true;
    const controller = new AbortController();
    cancelar.current = controller;
    setCancelando(false);
    if (!continuar || !progresso.current) {
      progresso.current = { fila: [...dados], proximo: 0, feitos: 0, ignorados: [] };
    }
    const checkpoint = progresso.current;
    setIgnorados([...checkpoint.ignorados]);
    setExecutando(true);
    onExecutando(true);
    const fila = checkpoint.fila;
    let feitos = checkpoint.feitos;
    let mensagem = "";
    setEstado({ total: fila.length, feitos, atual: "", mensagem: "" });
    try {
      if (!dialog.current?.open) dialog.current?.showModal();
      await executarFila({ itens: fila.slice(checkpoint.proximo), signal: controller.signal, atualizar: atualizarUmCfc,
        motivoIgnorar: motivoIgnorarCfc,
        erroIgnoravel: (erro) => erro instanceof ConsultaCfcInvalida,
        aoIgnorar: (cfc, motivo) => {
          checkpoint.proximo++;
          checkpoint.ignorados.push(`${cfc.nomeFantasia || cfc.nome || "CFC"} (ID ${cfc.id}) — ${cfc.cnpj || "sem CNPJ"}: ${motivo}`);
          if (montado.current) setIgnorados([...checkpoint.ignorados]);
        },
        aoIniciar: (cfc) => { if (montado.current) setEstado({ total: fila.length, feitos, atual: (cfc.nomeFantasia || cfc.nome || "CFC") + " — " + cfc.cnpj, mensagem: "" }); },
        aoConcluir: (atualizado) => {
          checkpoint.proximo++;
          feitos = ++checkpoint.feitos;
          if (montado.current) { onAtualizado(atualizado); setEstado((valor) => ({ ...valor, feitos })); }
        },
      });
      mensagem = controller.signal.aborted ? "Cancelado. As alterações já concluídas foram mantidas." : "Atualização concluída.";
    } catch (e: unknown) {
      const cfc = fila[checkpoint.proximo];
      if (cfc) {
        checkpoint.ignorados.push(`${cfc.nomeFantasia || cfc.nome || "CFC"} (ID ${cfc.id}): requer conferência após erro. Não será repetido ao continuar.`);
        checkpoint.proximo++;
      }
      mensagem = "Fila interrompida: " + (e instanceof Error ? e.message : "Erro inesperado.") + " Confira o último cadastro. Continuar seguirá para o próximo, sem repetir o cadastro com erro.";
    } finally {
      if (montado.current) {
        setPendentes(fila.length - checkpoint.proximo);
        setIgnorados([...checkpoint.ignorados]);
        setEstado((valor) => ({ ...valor, feitos, mensagem }));
        setExecutando(false);
        onExecutando(false);
      }
      liberar();
      trava.current = false;
    }
  }
  return <>
    <button className="fb-btn-buscar" disabled={disabled || executando || !dados.length || pendentes > 0} onClick={() => iniciar()}>
      Atualizar todos os CFCs carregados ({dados.length})
    </button>
    {pendentes > 0 && <button className="fb-btn-buscar" disabled={disabled || executando} onClick={() => iniciar(true)}>
      Continuar atualização ({pendentes} restantes)
    </button>}
    {erroInicio && <p role="alert">{erroInicio}</p>}

    <dialog ref={dialog} aria-labelledby="atualizar-cfcs-titulo" aria-describedby="atualizar-cfcs-descricao"
      onCancel={(e) => { if (executando) { e.preventDefault(); parar(); } }}
      style={{ margin: "auto", padding: "2rem", width: "min(520px, 92vw)", borderRadius: 16, border: "1px solid var(--border-color)", background: "var(--surface-color)", color: "var(--text-primary)" }}>
      <h2 id="atualizar-cfcs-titulo">Atualizando CFCs</h2>
      <p id="atualizar-cfcs-descricao" style={{ margin: "1rem 0" }}>Um CFC por vez, com intervalo de 2 segundos após cada cadastro, antes de iniciar o próximo. Cadastros com CNPJ ou ID inválido serão ignorados. Escopo: página 1, até 500 CFCs carregados, independentemente da busca.</p>
      <progress aria-label="CFCs processados" value={estado.feitos + ignorados.length} max={estado.total || 1} style={{ width: "100%" }} />
      <div role="status" aria-live="polite">
        <p>{estado.feitos} atualizados · {ignorados.length} ignorados · {estado.total - estado.feitos - ignorados.length} restantes · {estado.total} no total</p>
        <p style={{ margin: "1rem 0", overflowWrap: "anywhere" }}>{estado.atual && `${executando ? "CFC atual" : "Último CFC processado"}: ${estado.atual}`}</p>
        <p>{estado.mensagem || (cancelando ? "Cancelando: aguardando o CFC atual terminar. O próximo não será iniciado." : "Consultando o DETRAN e salvando o cadastro atual.")}</p>
      </div>
      {ignorados.length > 0 && <details style={{ marginTop: "1rem", maxHeight: "180px", overflow: "auto" }}>
        <summary>Cadastros ignorados ({ignorados.length})</summary>
        <ul>{ignorados.map((item, indice) => <li key={indice} style={{ overflowWrap: "anywhere" }}>{item}</li>)}</ul>
      </details>}
      <button autoFocus className="fb-btn-buscar" style={{ marginTop: "1.5rem" }} aria-disabled={executando && cancelando}
        onClick={() => executando ? parar() : dialog.current?.close()}>
        {executando ? (cancelando ? "Cancelando..." : "Cancelar atualização") : "Fechar"}
      </button>
      {!executando && pendentes > 0 && <button className="fb-btn-buscar" style={{ marginTop: "1rem", marginLeft: "1rem" }}
        disabled={disabled} onClick={() => iniciar(true)}>Continuar atualização</button>}
    </dialog>
  </>;
}


