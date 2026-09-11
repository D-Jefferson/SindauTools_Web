import { useEffect, useRef, useState } from "react";
import { atualizarUmCfc, buscarCfcs, type Cfc } from "../../api/Sindauto/cfcs";
import { useDemo } from "../../context/demo";
import "../Home/home.css";
import AtualizarCfcsModal from "./AtualizarCfcsModal";
import { adquirirAtualizacao } from "./filaCfcs";
import ExportarCfcs from "./ExportacaoCfcsModal";
import "./cfcs.css";

const locais: Record<number, string> = {
  1: "SALVADOR", 2: "XIQUE XIQUE", 3: "FEIRA DE SANTANA",
  4: "ITABUNA", 5: "VITÓRIA DA CONQUISTA",
};
const normalizar = (texto: string) => texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const formatarCnpj = (cnpj?: string | null) =>
  cnpj?.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5") || "—";

export default function Cfcs() {
  const { isDemo } = useDemo();
  const [dados, setDados] = useState<Cfc[]>([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [atualizacao, setAtualizacao] = useState(0);
  const [selecionado, setSelecionado] = useState<number | null>(null);
  const [atualizando, setAtualizando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const trava = useRef(false);
  const montado = useRef(false);
  const [filaExecutando, setFilaExecutando] = useState(false);
  const ocupado = atualizando || filaExecutando;
  useEffect(() => {
    montado.current = true;
    return () => { montado.current = false; };
  }, []);
  const cfcSelecionado = dados.find((cfc) => cfc.id === selecionado);

  async function atualizarSelecionado() {
    if (trava.current || ocupado || carregando || !cfcSelecionado || isDemo) return;
    const liberar = adquirirAtualizacao();
    if (!liberar) { setErro("Uma atualização anterior ainda está terminando. Aguarde antes de iniciar outra."); return; }
    trava.current = true;
    setAtualizando(true);
    setErro("");
    setMensagem("");
    try {
      const atualizado = await atualizarUmCfc(cfcSelecionado);
      if (!montado.current) return;
      setDados((lista) => lista.map((item) => item.id === atualizado.id ? atualizado : item));
      setMensagem('Atualização concluída: ' + (atualizado.nomeFantasia || atualizado.nome) + ' — CNPJ ' + formatarCnpj(atualizado.cnpj) + '. Apenas este CFC foi atualizado.');
    } catch (e: unknown) {
      if (montado.current) setErro(e instanceof Error ? e.message : "Erro ao atualizar o CFC.");
    } finally {
      trava.current = false;
      liberar();
      if (montado.current) setAtualizando(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    setCarregando(true);
    setErro("");
    if (isDemo) {
      setDados([]);
      setCarregando(false);
      return () => controller.abort();
    }
    buscarCfcs(controller.signal)
      .then((lista) => { if (!controller.signal.aborted) setDados(lista); })
      .catch((e: unknown) => {
        if (!controller.signal.aborted) setErro(e instanceof Error ? e.message : "Erro ao consultar os CFCs.");
      })
      .finally(() => { if (!controller.signal.aborted) setCarregando(false); });
    return () => controller.abort();
  }, [atualizacao, isDemo]);

  const termo = normalizar(busca.trim());
  const filtrados = dados.filter((cfc) => {
    const texto = normalizar([cfc.nomeFantasia, cfc.razaoSocial, cfc.nome, cfc.cidade, cfc.cnpj, formatarCnpj(cfc.cnpj), cfc.codCfcDetran].join(" "));
    return texto.includes(termo);
  });

  return (
    <div className="fb-container">
      <div className="st-search-titles">
        <h1>CFC<span>s</span></h1>
        <p>Consulte os centros de formação de condutores.</p>
      </div>
      <div className="fb-filter-row">
        <div className="fb-filter-group" style={{ flex: 1 }}>
          <label htmlFor="cfc-busca">Buscar CFC</label>
          <input id="cfc-busca" className="fb-input" type="search"
            placeholder="Nome, CNPJ, código ou cidade"
            value={busca} onChange={(e) => setBusca(e.target.value)} />
        </div>
        <button className="fb-btn-buscar" disabled={carregando || ocupado || isDemo}
          onClick={() => setAtualizacao((valor) => valor + 1)}>
          <i aria-hidden="true" className={carregando ? "fas fa-circle-notch fa-spin" : "fas fa-sync-alt"} />
          {carregando ? " Carregando..." : " Recarregar lista"}
        </button>
        <ExportarCfcs dados={filtrados} disabled={carregando || ocupado || isDemo} />
      </div>
      <div className="fb-filter-row">
        <div className="fb-filter-group" style={{ flex: 1 }}>
          <label htmlFor="cfc-teste">CFC para o teste (apenas um)</label>
          <select id="cfc-teste" className="fb-input" value={selecionado ?? ""}
            disabled={carregando || ocupado} onChange={(e) => setSelecionado(e.target.value ? Number(e.target.value) : null)}>
            <option value="">Selecione um CFC</option>
            {dados.map((cfc) => <option key={cfc.id} value={cfc.id}>{cfc.nomeFantasia || cfc.nome} — {formatarCnpj(cfc.cnpj)}</option>)}
          </select>
        </div>
        <button className="fb-btn-buscar" onClick={atualizarSelecionado}
          disabled={!cfcSelecionado || carregando || ocupado || isDemo}>
          <i aria-hidden="true" className={atualizando ? "fas fa-circle-notch fa-spin" : "fas fa-sync-alt"} />
          {atualizando ? " Atualizando 1 CFC..." : " Atualizar somente o CFC selecionado"}
        </button>
      <AtualizarCfcsModal dados={dados} disabled={carregando || atualizando || isDemo}
        onExecutando={setFilaExecutando}
        onAtualizado={(atualizado) => setDados((lista) => lista.map((item) => item.id === atualizado.id ? atualizado : item))} />
      </div>
      {(atualizando || mensagem) && <p role="status">{atualizando ? "Atualizando o CFC selecionado..." : mensagem}</p>}
      {erro && <div className="st-erro-msg" role="alert">{erro}</div>}
      {carregando && <p role="status">Carregando CFCs...</p>}
      {dados.length > 0 && (
        <div className="fb-table-card" aria-busy={carregando}>
          <div className="fb-stats-row">
            <div className="fb-stat-chip">
              <span className="fb-stat-count">{filtrados.length}</span>
              <div className="fb-stat-labels"><span className="top">CFCs exibidos</span><span className="bot">de {dados.length} carregados · página 1, até 500</span></div>
              <span className="fb-sort-badge">Nome A–Z</span>
            </div>
          </div>
          <div className="fb-table-scroll">
            <table className="fb-table">
              <thead><tr><th>CFC</th><th>CNPJ</th><th>Código DETRAN</th><th>Cidade / UF</th><th>Vencimento</th><th>Foto/Biometria</th></tr></thead>
              <tbody>{filtrados.map((cfc) => (
                <tr key={cfc.id}>
                  <td><div className="fb-td-name">{cfc.nomeFantasia || cfc.razaoSocial || cfc.nome || "—"}</div>
                    {cfc.nomeFantasia && cfc.razaoSocial && cfc.nomeFantasia !== cfc.razaoSocial &&
                      <div className="fb-td-name-sub">{cfc.razaoSocial}</div>}</td>
                  <td className="fb-td-cpf">{formatarCnpj(cfc.cnpj)}</td>
                  <td>{cfc.codCfcDetran ?? "—"}</td>
                  <td>{[cfc.cidade, cfc.estado].filter(Boolean).join(" / ") || "—"}</td>
                  <td>{cfc.dataValidade ? cfc.dataValidade.slice(0, 10).split("-").reverse().join("/") : "—"}</td>
                  <td><span className="fb-local-badge">{cfc.idLocalFotoBiometria == null ? "Não informado" : locais[cfc.idLocalFotoBiometria] || `Local ${cfc.idLocalFotoBiometria}`}</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          {filtrados.length === 0 && <div className="fb-empty"><p>Nenhum CFC corresponde à busca.</p></div>}
        </div>
      )}
      {!carregando && !erro && dados.length === 0 &&
        <div className="fb-empty"><i className="fas fa-building" aria-hidden="true" /><p>{isDemo ? "Entre com sua conta para consultar os CFCs." : "Nenhum CFC encontrado."}</p></div>}
    </div>
  );
}





