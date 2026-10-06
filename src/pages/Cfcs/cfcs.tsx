import { useEffect, useState } from "react";
import { buscarCfcs, type Cfc } from "../../api/Sindauto/cfcs";
import { useDemo } from "../../context/demo";
import "../Home/home.css";
import AtualizarCfcsModal from "./AtualizarCfcsModal";
import ExportarCfcs from "./ExportacaoCfcsModal";
import "./cfcs.css";

const locais: Record<number, string> = {
  1: "SALVADOR", 2: "XIQUE XIQUE", 3: "FEIRA DE SANTANA",
  4: "ITABUNA", 5: "VITÓRIA DA CONQUISTA",
};
const normalizar = (texto: string) => texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const formatarCnpj = (cnpj?: string | null) =>
  cnpj?.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5") || "—";

type Coluna = "nome" | "cnpj" | "codigo" | "cidade" | "vencimento" | "foto";
const colunas: { chave: Coluna; titulo: string }[] = [
  { chave: "nome", titulo: "CFC" }, { chave: "cnpj", titulo: "CNPJ" },
  { chave: "codigo", titulo: "Código DETRAN" }, { chave: "cidade", titulo: "Cidade / UF" },
  { chave: "vencimento", titulo: "Vencimento" }, { chave: "foto", titulo: "Foto/Biometria" },
];
function valorColuna(cfc: Cfc, coluna: Coluna): string {
  switch (coluna) {
    case "nome": return cfc.nomeFantasia || cfc.razaoSocial || cfc.nome || "";
    case "cnpj": return (cfc.cnpj || "").replace(/\D/g, "");
    case "codigo": return String(cfc.codCfcDetran ?? "");
    case "cidade": return [cfc.cidade, cfc.estado].filter(Boolean).join(" / ");
    case "vencimento": return cfc.dataValidade?.slice(0, 10) || "";
    case "foto": return cfc.idLocalFotoBiometria == null ? "" : locais[cfc.idLocalFotoBiometria] || `Local ${cfc.idLocalFotoBiometria}`;
  }
}
export default function Cfcs() {
  const { isDemo } = useDemo();
  const [dados, setDados] = useState<Cfc[]>([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [atualizacao, setAtualizacao] = useState(0);
  const [filaExecutando, setFilaExecutando] = useState(false);
  const ocupado = filaExecutando;
  const [ordenacao, setOrdenacao] = useState<{ coluna: Coluna; crescente: boolean }>({ coluna: "nome", crescente: true });
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
  }).sort((a, b) => {
    const primeiro = valorColuna(a, ordenacao.coluna);
    const segundo = valorColuna(b, ordenacao.coluna);
    if (primeiro === "") return segundo === "" ? 0 : 1;
    if (segundo === "") return -1;
    const resultado = primeiro.localeCompare(segundo, "pt-BR", { numeric: true, sensitivity: "base" });
    return ordenacao.crescente ? resultado : -resultado;
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
        <AtualizarCfcsModal dados={dados} disabled={carregando || isDemo}
          onExecutando={setFilaExecutando}
          onAtualizado={(atualizado) => setDados((lista) => lista.map((item) => item.id === atualizado.id ? atualizado : item))} />
      </div>
      {erro && <div className="st-erro-msg" role="alert">{erro}</div>}
      {carregando && <p role="status">Carregando CFCs...</p>}
      {dados.length > 0 && (
        <div className="fb-table-card" aria-busy={carregando}>
          <div className="fb-stats-row">
            <div className="fb-stat-chip">
              <span className="fb-stat-count">{filtrados.length}</span>
              <div className="fb-stat-labels"><span className="top">CFCs exibidos</span><span className="bot">de {dados.length} carregados · página 1, até 500</span></div>
              <span className="fb-sort-badge">{colunas.find((item) => item.chave === ordenacao.coluna)?.titulo} · {ordenacao.crescente ? "Crescente" : "Decrescente"}</span>
            </div>
          </div>
          <div className="fb-table-scroll">
            <table className="fb-table">
              <thead><tr>{colunas.map(({ chave, titulo }) => (
                <th key={chave} scope="col" aria-sort={ordenacao.coluna === chave ? (ordenacao.crescente ? "ascending" : "descending") : "none"}>
                  <button type="button" className="cfc-sort-button"
                    onClick={() => setOrdenacao((anterior) => ({ coluna: chave, crescente: anterior.coluna === chave ? !anterior.crescente : true }))}>
                    {titulo} <span aria-hidden="true">{ordenacao.coluna === chave ? (ordenacao.crescente ? "▲" : "▼") : "↕"}</span>
                  </button>
                </th>
              ))}</tr></thead>
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
