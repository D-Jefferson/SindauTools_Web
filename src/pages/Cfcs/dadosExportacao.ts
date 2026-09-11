import type { Cfc } from "../../api/Sindauto/cfcs";

const locais: Record<number, string> = { 1: "SALVADOR", 2: "XIQUE XIQUE", 3: "FEIRA DE SANTANA", 4: "ITABUNA", 5: "VITÓRIA DA CONQUISTA" };
export const cabecalhos = ["CFC", "CNPJ", "Código DETRAN", "Cidade / UF", "Vencimento", "Foto/Biometria"];
export function linhasCfcs(dados: Cfc[]) {
  return dados.map(cfc => [
    cfc.nomeFantasia || cfc.razaoSocial || cfc.nome || "—",
    cfc.cnpj?.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5") || "—",
    String(cfc.codCfcDetran ?? "—"),
    [cfc.cidade, cfc.estado].filter(Boolean).join(" / ") || "—",
    cfc.dataValidade ? cfc.dataValidade.slice(0, 10).split("-").reverse().join("/") : "—",
    cfc.idLocalFotoBiometria == null ? "Não informado" : locais[cfc.idLocalFotoBiometria] || `Local ${cfc.idLocalFotoBiometria}`,
  ]);
}
export function gerarCsv(dados: Cfc[]) {
  const celula = (valor: string) => {
    // Keep API content as text rather than spreadsheet formulas.
    const seguro = /^[\s]*[=+@-]/.test(valor) ? "'" + valor : valor;
    return '"' + seguro.replace(/"/g, '""') + '"';
  };
  return '\uFEFF' + [cabecalhos, ...linhasCfcs(dados)].map(linha => linha.map(celula).join(';')).join('\r\n');
}
export function gerarRelatorio(dados: Cfc[]) {
  const escapar = (valor: string) => valor.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>CFCs - SindauTools</title>
    <style>@page{size:A4 landscape;margin:12mm}body{font:10pt Arial,sans-serif;color:#17212b}h1{font-size:20pt;margin-bottom:8px}p{color:#475569}table{width:100%;border-collapse:collapse;table-layout:fixed}th,td{padding:7px;text-align:left;border:1px solid #cbd5e1;overflow-wrap:anywhere}th{background:#e2e8f0}th:first-child{width:27%}thead{display:table-header-group}tr{break-inside:avoid}button{padding:10px 18px;margin-bottom:12px;cursor:pointer}@media print{button{display:none}}</style>
    </head><body><button onclick="window.print()">Salvar como PDF / Imprimir</button><h1>CFCs - SindauTools</h1>
    <p>${dados.length} CFCs exibidos · Exportação da lista carregada (página 1, até 500).</p>
    <table><thead><tr>${cabecalhos.map(c => `<th>${escapar(c)}</th>`).join('')}</tr></thead><tbody>${linhasCfcs(dados).map(l => `<tr>${l.map(c => `<td>${escapar(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></body></html>`;
}
