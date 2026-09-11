import { useRef, useState } from "react";
import type { Cfc } from "../../api/Sindauto/cfcs";
import { gerarCsv, gerarRelatorio } from "./dadosExportacao";

export default function ExportarCfcs({ dados, disabled }: { dados: Cfc[]; disabled: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [erro, setErro] = useState("");
  function exportar(pdf: boolean) {
    if (disabled || !dados.length) return;
    setErro("");
    if (pdf) {
      const janela = window.open("", "_blank");
      if (!janela) { setErro("Permita abrir uma nova janela para salvar o PDF."); return; }
      janela.opener = null;
      janela.document.write(gerarRelatorio(dados));
      janela.document.close();
      janela.focus();
      janela.print();
    } else {
      const url = URL.createObjectURL(new Blob([gerarCsv(dados)], { type: "text/csv;charset=utf-8" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `cfcs-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
    dialog.current?.close();
  }
  return <>
    <button className="fb-btn-buscar" disabled={disabled || !dados.length} onClick={() => { setErro(""); dialog.current?.showModal(); }}>
      <i className="fas fa-download" aria-hidden="true" /> Exportar
    </button>
    <dialog className="cfc-export-dialog" ref={dialog} aria-labelledby="cfc-export-title" aria-describedby="cfc-export-description">
      <h2 id="cfc-export-title">Exportar CFCs</h2>
      <p id="cfc-export-description">Exportar os {dados.length} CFCs exibidos na tabela, respeitando a busca.</p>
      <div className="cfc-export-actions">
        <button autoFocus className="fb-btn-buscar" disabled={disabled || !dados.length} onClick={() => exportar(false)}>Planilha (CSV)</button>
        <button className="fb-btn-buscar" disabled={disabled || !dados.length} onClick={() => exportar(true)}>PDF</button>
        <button className="fb-btn-buscar" onClick={() => dialog.current?.close()}>Fechar</button>
      </div>
      <p>Para PDF, escolha “Salvar como PDF” na janela de impressão.</p>
      {erro && <p role="alert">{erro}</p>}
    </dialog>
  </>;
}

