import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/global.css";
import { toast } from "react-toastify";

const FiltroCPF2: React.FC = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [validos, setValidos] = useState<string[]>([]);
  const [invalidos, setInvalidos] = useState<string[]>([]);

  // --- Função de validação de CPF ---
  const validarCPF = (cpf: string): boolean => {
    cpf = cpf.replace(/[^\d]/g, "");
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;

    return resto === parseInt(cpf.charAt(10));
  };

  // --- NOVO: extrai apenas CPFs do texto, sem ponto e sem traço ---
  const extrairCpfs = (texto: string): string[] => {
    // pega qualquer padrão de CPF com ou sem pontuação
    const matches = texto.match(/\d{3}\.?\d{3}\.?\d{3}-?\d{2}/g);
    if (!matches) return [];

    // remove tudo que não for dígito e remove duplicados
    const limpos = matches.map((cpf) => cpf.replace(/\D/g, ""));
    const unicos = Array.from(new Set(limpos));
    return unicos;
  };

  // --- Atualiza estatísticas em tempo real ---
  const atualizarListas = (texto: string) => {
    // NOVO: em vez de confiar em "linhas", agora eu extraio só os CPFs do texto
    const cpfs = extrairCpfs(texto);

    const v: string[] = [];
    const i: string[] = [];

    cpfs.forEach((cpf) => {
      if (validarCPF(cpf)) v.push(cpf);
      else i.push(cpf);
    });

    setValidos(v);
    setInvalidos(i);
  };

  // --- Eventos ---
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);
    atualizarListas(value);
  };

  const limpar = () => {
    setInput("");
    setValidos([]);
    setInvalidos([]);
    toast.success("Campos limpos com sucesso!");
  };

  // --- NOVO: botão copiar corrigido (async + tratamento de erro) ---
  const copiar = async () => {
    if (!validos.length) {
      toast.warn("Não há CPFs válidos para copiar.");
      return;
    }

    const texto = validos.join("\n");

    try {
      await navigator.clipboard.writeText(texto);
      toast.success("CPFs válidos (um por linha) copiados!");
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível copiar automaticamente. Verifique as permissões do navegador.");
    }
  };

  const envirgular = async () => {
    if (!validos.length) {
      toast.warn("Não há CPFs válidos para envirgular.");
      return;
    }

    const texto = validos.join(", ");

    try {
      await navigator.clipboard.writeText(texto);
      toast.success("CPFs válidos separados por vírgula copiados!");
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível copiar automaticamente. Verifique as permissões do navegador.");
    }
  };

  const exportarCsv = () => {
    const csv = ["CPF,Status"];
    validos.forEach((cpf) => csv.push(`${cpf},Válido`));
    invalidos.forEach((cpf) => csv.push(`${cpf},Inválido`));

    const blob = new Blob([csv.join("\n")], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "cpfs.csv";
    link.click();

    toast.success("CSV exportado com sucesso!");
  };

  return (
    <div className="page-container">
      {/* MENU LATERAL */}
      <aside className="menu-lateral-inicio">
        <div className="menu-lateral-logo">
          <h1>
            SINDAU<span>TOOLS</span>
          </h1>
        </div>

        <div className="perfil">
          <div className="perfil-icone">S</div>
          <div className="perfil-info">
            <div className="perfil-nome">Suporte</div>
            <div className="perfil-tipo">Administrador</div>
          </div>
        </div>

        <nav className="lateral-nav">
          <a onClick={() => navigate("/demo/home")}>
            <i className="fas fa-home"></i>
            <span>Início</span>
          </a>

          <a onClick={() => navigate("/demo/ferramentas")}>
            <i className="fas fa-tools"></i>
            <span>Ferramentas</span>
          </a>

          <a onClick={() => navigate("/demo/sobre")}>
            <i className="fas fa-book"></i>
            <span>Sobre</span>
          </a>

          <a onClick={() => navigate("/demo/filtrocpf")} className="active">
            <i className="fa-solid fa-filter"></i>
            <span>Filtro CPF</span>
          </a>

          <a onClick={() => navigate("/demo/ajuda")}>
            <i className="fas fa-info-circle"></i>
            <span>Ajuda</span>
          </a>
        </nav>

        <div className="assina" style={{ backgroundColor: "rgba(240,248,255,0)" }}>
          <p style={{ color: "#b8b8b8" }}>@By Jefferson Levy</p>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="container" style={{ marginRight: "400px" }}>
        <div className="pesquisa">
          <div className="sub-info">
            <a onClick={() => navigate("/home")}>Início</a>
            <span className="separado">/</span>
            <span>Filtro CPF</span>
          </div>
        </div>

        <div className="h22">
          <h2>Filtro CPF</h2>
        </div>

        <section
          id="filtroCPFSection"
          style={{ marginTop: 20, display: "flex", gap: "20px" }}
        >
          <textarea
            value={input}
            onChange={handleInput}
            placeholder="Cole aqui o texto contendo CPFs, nomes, etc... que eu extraio só os CPFs."
            className="textarea-cpf"
          />

          {/* Lateral direita */}
          <aside className="lateral-direito">
            <div style={{ display: validos.length + invalidos.length > 0 ? "block" : "none" }}>
              <div>
                <strong>CPFs Válidos:</strong>
                <div id="validList">
                  {validos.map((v, i) => (
                    <div key={i}>{v}</div>
                  ))}
                </div>
              </div>

              <button className="botaofiltro2" onClick={copiar}>
                Copiar (sem vírgula)
              </button>
              <button className="botaofiltro2" onClick={envirgular}>
                Copiar (com vírgula)
              </button>

              <div>
                <strong>CPFs Inválidos:</strong>
                <div id="invalidList">
                  {invalidos.map((v, i) => (
                    <div key={i}>{v}</div>
                  ))}
                </div>
              </div>

              <div className="stats" style={{ marginTop: 10, fontSize: 14, color: "#444" }}>
                <p>Válidos: {validos.length}</p>
                <p>Inválidos: {invalidos.length}</p>
              </div>
            </div>
          </aside>
        </section>

        <div style={{ marginTop: 10 }}>
          <button className="botaofiltro" onClick={limpar}>
            Limpar
          </button>
          <button className="botaofiltro" onClick={exportarCsv}>
            Exportar CSV
          </button>
        </div>
      </main>
    </div>
  );
};

export default FiltroCPF2;
