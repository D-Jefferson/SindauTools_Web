import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./formatadores.module.css";
import { toast } from "react-toastify";
import { copiarTexto } from "../../utils/clipboard";
import Ajuda from "../../components/modalAjuda";


import { useNotificacao } from "../../scripts/notificacao";
import { useMatricula } from "../../scripts/matricula";
import { useVincular } from "../../scripts/vincular";
import { useDesvincular } from "../../scripts/desvincular";


const Formatadores2: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as
    | { abaInicial?: "notificacao" | "vincular" | "desvincular" | "matricula" }
    | undefined;

  const [abaAtiva, setAbaAtiva] = useState<
    "notificacao" | "vincular" | "desvincular" | "matricula"
  >(state?.abaInicial || "notificacao");

  const [texto, setTexto] = useState("");
  const [cpf, setCpf] = useState("");

  const notificacao = useNotificacao();
  const matricula = useMatricula();
  const vincular = useVincular();
  const desvincular = useDesvincular();


   async function getapi(): Promise<void> {
  const cpfInput = document.getElementById("puxaruuid") as HTMLInputElement | null;

  if (!cpfInput) {
    console.error("Campo com id 'puxaruuid' não encontrado no DOM.");
    return;
  }

  const cpf = cpfInput.value.trim();
  if (!cpf) {
    toast.warn("Informe um CPF para buscar a matrícula.");
    return;
  }

  try {
    const data = [
      {
        numero_processo: "BA000000000",
        situacao_homologacao: "CRIADO",
        isDeleted: 0,
        origem: null,
        uuid: "47fdbc7e-01c7-451d-9437-93f9b3d8a255",
        cpf: cpf,
        nome: "LEANDRES SILVA",
        data_nascimento: "01/01/1999"
      }
    ];

        const aparecer = document.createElement("div");
    aparecer.style.position = "fixed";
    aparecer.style.top = "0";
    aparecer.style.left = "0";
    aparecer.style.width = "100vw";
    aparecer.style.height = "100vh";
    aparecer.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    aparecer.style.backdropFilter = "blur(6px)";
    aparecer.style.display = "flex";
    aparecer.style.justifyContent = "center";
    aparecer.style.alignItems = "center";
    aparecer.style.zIndex = "10000";
    aparecer.style.opacity = "0";
    aparecer.style.transition = "opacity 0.3s ease-out";

    const frente = document.createElement("div");
    frente.style.backgroundColor = "#2a2a2a";
    frente.style.padding = "0";
    frente.style.borderRadius = "12px";
    frente.style.maxWidth = "90%";
    frente.style.maxHeight = "85%";
    frente.style.width = "700px";
    frente.style.overflowY = "auto";
    frente.style.boxShadow =
      "0 25px 50px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)";
    frente.style.border = "1px solid #404040";
    frente.style.transform = "translateY(-20px)";
    frente.style.transition = "transform 0.3s ease-out";
    frente.style.color = "#ffffff";

    const header = document.createElement("div");
    header.style.padding = "24px 32px";
    header.style.background = "linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%)";
    header.style.borderBottom = "3px solid #dc2626";
    header.style.borderRadius = "12px 12px 0 0";
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "center";

    const titulo = document.createElement("h2");
    titulo.textContent = "DADOS COLETADOS DA RENOVA";
    titulo.style.margin = "0";
    titulo.style.fontSize = "18px";
    titulo.style.fontWeight = "600";
    titulo.style.color = "#ffffff";
    titulo.style.fontFamily =
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    titulo.style.letterSpacing = "0.5px";
    titulo.style.textTransform = "uppercase";

    const btnX = document.createElement("button");
    btnX.innerHTML = "×";
    btnX.style.background = "none";
    btnX.style.border = "none";
    btnX.style.fontSize = "24px";
    btnX.style.cursor = "pointer";
    btnX.style.color = "#9ca3af";
    btnX.style.padding = "4px 8px";
    btnX.style.borderRadius = "6px";
    btnX.style.transition = "all 0.2s ease";
    btnX.style.lineHeight = "1";

    btnX.onmouseover = () => {
      btnX.style.backgroundColor = "#404040";
      btnX.style.color = "#ffffff";
    };
    btnX.onmouseout = () => {
      btnX.style.backgroundColor = "transparent";
      btnX.style.color = "#9ca3af";
    };

    const conteudo = document.createElement("div");
    conteudo.style.padding = "32px";

    const pre = document.createElement("pre");
    pre.style.whiteSpace = "pre-wrap";
    pre.style.fontFamily =
      "'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', monospace";
    pre.style.fontSize = "13px";
    pre.style.lineHeight = "1.6";
    pre.style.backgroundColor = "#1a1a1a";
    pre.style.border = "1px solid #404040";
    pre.style.borderRadius = "8px";
    pre.style.padding = "20px";
    pre.style.margin = "0";
    pre.style.maxHeight = "400px";
    pre.style.overflowY = "auto";
    pre.style.color = "#e5e7eb";
    pre.style.boxShadow = "inset 0 2px 4px rgba(0, 0, 0, 0.3)";

    const footer = document.createElement("div");
    footer.style.display = "flex";
    footer.style.justifyContent = "flex-end";
    footer.style.gap = "12px";
    footer.style.padding = "24px 32px";
    footer.style.backgroundColor = "#1f1f1f";
    footer.style.borderTop = "1px solid #404040";
    footer.style.borderRadius = "0 0 12px 12px";

    const info = document.createElement("div");
    info.textContent =
      "Observação: Modo demonstração ativo - Os dados apresentados são apenas para demonstração sendo os mesmos ficticios.";
    info.style.padding = "8px 24px";
    info.style.fontSize = "12px";
    info.style.fontWeight = "500";
    info.style.borderRadius = "8px";
    info.style.border = "none";
    info.style.color = "#ffffff";
    info.style.cursor = "default";
    info.style.transition = "all 0.2s ease";
    info.style.fontStyle = "italic";

    function fecharModal() {
      aparecer.style.opacity = "0";
      frente.style.transform = "translateY(-20px)";
      setTimeout(() => {
        if (document.body.contains(aparecer)) {
          document.body.removeChild(aparecer);
          document.body.style.overflow = "";
        }
      }, 300);
    }

    btnX.onclick = fecharModal;

    aparecer.onclick = (e) => {
      if (e.target === aparecer) {
        fecharModal();
      }
    };

    const escapeHandler = function (e: KeyboardEvent) {
      if (e.key === "Escape" && document.body.contains(aparecer)) {
        fecharModal();
        document.removeEventListener("keydown", escapeHandler);
      }
    };
    document.addEventListener("keydown", escapeHandler);

    const texto = JSON.stringify(data, null, 2);
    let i = 0;

    function digitar() {
      if (i < texto.length) {
        pre.textContent += texto.charAt(i);
        i++;
        // tempo bem curto, mas não zero pra não travar
        setTimeout(digitar, 5);
      }
    }

    header.appendChild(titulo);
    header.appendChild(btnX);
    conteudo.appendChild(pre);
    footer.appendChild(info);
    frente.appendChild(header);
    frente.appendChild(conteudo);
    frente.appendChild(footer);
    aparecer.appendChild(frente);

    document.body.appendChild(aparecer);
    document.body.style.overflow = "hidden";

    requestAnimationFrame(() => {
      aparecer.style.opacity = "1";
      frente.style.transform = "translateY(0)";
      setTimeout(digitar, 500);
    });
  } catch (error) {
    console.error("Erro ao buscar matrícula:", error);
    toast.error("Erro ao buscar matrícula.\n Verifique o CPF.");
  }
}

  const limparResultados = (secao: string) => {
    setTexto("");
    setCpf("");
    if (secao === "notificacao") notificacao.limpar();
    if (secao === "matricula") matricula.limpar();
    if (secao === "vincular") vincular.limpar();
    if (secao === "desvincular") desvincular.limpar();
  };
  const [copiadoIndex, setCopiadoIndex] = useState<number | null>(null);

  const handleCopiar = async (dados: any, index: number) => {
    const texto = JSON.stringify(dados, null, 2);
    await copiarTexto(texto);
    toast.success("Copiado para a área de transferência!");
    setCopiadoIndex(index);
  };

  const handleEnviar = async (item: any) => {
    try {
      toast.success("Enviado com sucesso!");
    } catch (err) {
      toast.error("Erro ao enviar!");
      console.error(err);
    }
  };

  return (
    <div className={styles["page-container"]}>
      {/* MENU LATERAL */}
      <aside className={styles["menu-lateral-inicio"]}>
        <div className={styles["menu-lateral-logo"]}>
          <h1>
            SINDAU<span>TOOLS</span>
          </h1>
        </div>

        <div className={styles["perfil"]}>
          <button className="button1">DEMO</button>
        </div>

        <nav className="lateral-nav">

          <a onClick={() => navigate("/demo/ferramentas")} className="active">
            <i className="fas fa-tools"></i>
            <span>Ferramentas</span>
          </a>

          <a onClick={() => navigate("/ferramentas")}>
            <i className="fas fa-undo"></i>
            <span>Voltar</span>
          </a>
        </nav>

        <div
          className={styles["assina"]}
          style={{ backgroundColor: "transparent" }}
        >
          <p style={{ color: "#b8b8b8" }}>@By Jefferson Levy</p>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className={styles["container"]}>
        {/* Botões de navegação entre os formatadores */}
        <div className={styles["nav-menus"]}>
          <button
            className={`${styles["nav-menu"]} ${
              abaAtiva === "notificacao" ? styles["active"] : ""
            }`}
            onClick={() => setAbaAtiva("notificacao")}
          >
            Notificação Financeira
          </button>
          <button
            className={`${styles["nav-menu"]} ${
              abaAtiva === "vincular" ? styles["active"] : ""
            }`}
            onClick={() => setAbaAtiva("vincular")}
          >
            Vincular Candidato
          </button>
          <button
            className={`${styles["nav-menu"]} ${
              abaAtiva === "desvincular" ? styles["active"] : ""
            }`}
            onClick={() => setAbaAtiva("desvincular")}
          >
            Desvincular Candidato
          </button>
          <button
            className={`${styles["nav-menu"]} ${
              abaAtiva === "matricula" ? styles["active"] : ""
            }`}
            onClick={() => setAbaAtiva("matricula")}
          >
            Enviar Matrícula
          </button>
        </div>

        {/* SEÇÃO NOTIFICAÇÃO */}
        {abaAtiva === "notificacao" && (
          <section>
            <div className={styles["h22"]}>
              <h2>FORMATADOR NOTIFICAÇÃO</h2>
            </div>

            <div className={styles["inserir-area"]}>
              <textarea
                placeholder="Cole aqui os dados para a notificação financeira..."
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
              />
              <div className={styles["resultados-area"]}>
                {notificacao.resultados.map((r, i) => (
                  <div key={i} className={styles["resultados-item"]}>
                    <pre>{JSON.stringify(r, null, 2)}</pre>
                    <button
                      className={styles["botao-copiar"]}
                      onClick={() => handleEnviar(r)}
                    >
                      Enviar
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles["botoes"]}>
              <button
                className={styles["formatar"]}
                onClick={() => notificacao.formatar(texto)}
              >
                Formatar
              </button>
              <button
                className={styles["apagar"]}
                onClick={() => limparResultados("notificacao")}
              >
                Limpar
              </button>
              <button
                className={styles["exportar"]}
                onClick={() => notificacao.exportar()}
              >
                Exportar CSV
              </button>
              <button
                className={styles["exportar"]}
                style={{background: "linear-gradient(to right, #9c9c9cff, #535353ff)"}}
                  onClick={() => {
                    navigator.clipboard.writeText("e54434ae-ac27-11ef-b09f-4232e8cfb637	CADASTRO	2024-11-26T18:54:42-0300	e69209e3-da98-4a71-acdd-9b68127b773a	07344454000129	CONCLUIDO	789412227	EFIPAY	40.5	2024-11-21T08:23:16-0300	2024-11-21T08:23:16-0300	2024-11-21T08:15:05-0300	paid");
                    toast.success("Texto copiado!");
                  }}
              >
                Copiar dado teste
              </button>
            </div>
              <div className={styles["h22"]} style={{marginTop: '40px'}}>
                <h2>Buscar matrícula Renova</h2>
                <input
                  id="puxaruuid"
                  type="text"
                  placeholder="Digite o CPF"
                  style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #444",backgroundColor: "#181818ff", color: "#fff", marginLeft: 10 }}
                />
                <button
                  style={{marginLeft:"10px", padding: "8px 12px", borderRadius: 6, border: "none", backgroundColor: "#866b12ff", color: "#ffffffff", cursor: "pointer" }}
                  onClick={getapi}>
                  Buscar na Renova
                  
                </button>

              </div>
          </section>
        )}

        {/* SEÇÃO VINCULAR */}
        {abaAtiva === "vincular" && (
          <section>
            <div className={styles["h22"]}>
              <h2>FORMATADOR VINCULAR</h2>
            </div>

            <div className={styles["inserir-area"]}>
              <textarea
                placeholder="Cole aqui os UUIDs dos agendamentos..."
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
              />
              <div className={styles["resultados-area"]}>
                {vincular.resultados.map((r, i) => (
                  <div key={i} className={styles["resultados-item"]}>
                    <pre>{JSON.stringify(r, null, 2)}</pre>
                    <button className={styles["botao-copiar"]} onClick={() => handleCopiar(r, i)}
                        style={{
                            backgroundColor:
                              copiadoIndex === i ? "#2e6592ff" : undefined,
                          }}
                        >
                          {copiadoIndex === i ? "Copiado!" : "Copiar"}</button>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles["botoes"]}>
              <button
                className={styles["formatar"]}
                onClick={() => { vincular.formatar(texto, cpf);setCopiadoIndex([]);}}
              >
                Formatar
              </button>
              <input
                className={styles["cpf"]}
                type="text"
                placeholder="Cole aqui o CPF"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
              />
              <button
                className={styles["apagar"]}
                onClick={() => limparResultados("vincular")}
              >
                Limpar
              </button>
              <button
                className={styles["exportar"]}
                onClick={() => vincular.exportar()}
              >
                Exportar CSV
              </button>
            </div>
          </section>
        )}

        {/* SEÇÃO DESVINCULAR */}
        {abaAtiva === "desvincular" && (
          <section>
            <div className={styles["h22"]}>
              <h2>FORMATADOR DESVINCULAR</h2>
            </div>

            <div className={styles["inserir-area"]}>
              <textarea
                placeholder="Cole aqui os UUIDs dos agendamentos..."
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
              />
              <div className={styles["resultados-area"]}>
                {desvincular.resultados.map((r, i) => (
                  <div key={i} className={styles["resultados-item"]}>
                    <pre>{JSON.stringify(r, null, 2)}</pre>
                      <button className={styles["botao-copiar"]} onClick={() => handleCopiar(r, i)}
                        style={{
                            backgroundColor:
                              copiadoIndex === i ? "#2e6592ff" : undefined,
                          }}
                        >
                          {copiadoIndex === i ? "Copiado!" : "Copiar"}</button>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles["botoes"]}>
              <button
                className={styles["formatar"]}
                onClick={() => {desvincular.formatar(texto, cpf); setCopiadoIndex([]);}}
              >
                Formatar
              </button>
              <input
                className={styles["cpf"]}
                type="text"
                placeholder="Cole aqui o CPF"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
              />
              <button
                className={styles["apagar"]}
                onClick={() => limparResultados("desvincular")}
              >
                Limpar
              </button>
              <button
                className={styles["exportar"]}
                onClick={() => desvincular.exportar()}
              >
                Exportar CSV
              </button>
            </div>
          </section>
        )}

        {/* SEÇÃO MATRÍCULA */}
        {abaAtiva === "matricula" && (
          <section>
            <div className={styles["h22"]}>
              <h2>FORMATADOR MATRÍCULA</h2>
            </div>

            <div className={styles["inserir-area"]}>
              <textarea
                placeholder="Cole aqui os dados para envio de matrícula..."
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
              />
              <div className={styles["resultados-area"]}>
                {matricula.resultados.map((r, i) => (
                  <div key={i} className={styles["resultados-item"]}>
                    <pre>{JSON.stringify(r, null, 2)}</pre>
                      <button className={styles["botao-copiar"]} onClick={() => handleCopiar(r, i)}
                        style={{
                            backgroundColor:
                              copiadoIndex === i ? "#2e6592ff" : undefined,
                          }}
                        >
                          {copiadoIndex === i ? "Copiado!" : "Copiar"}</button>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles["botoes"]}>
              <button
                className={styles["formatar"]}
                onClick={() => {matricula.formatar(texto); setCopiadoIndex([]);}}
              >
                Formatar
              </button>
              <button
                className={styles["apagar"]}
                onClick={() => limparResultados("matricula")}
              >
                Limpar
              </button>
              <button
                className={styles["exportar"]}
                onClick={() => matricula.exportar()}
              >
                Exportar CSV
              </button>
            </div>
          </section>
        )}
        <Ajuda
        titulo="Como funciona?"
        texto="Ao pegar os dados do banco de dados para enviar para Renova, cole no campo acima clique em formatar e depois em enviar. O sistema irá formatar em json e enviar automaticamente para REnova. Em Buscar matricula puxa a matricula que existe la na renovaAo obter os dados do banco de dados para envio ao Renova, cole as informações no campo acima.
          Em seguida, clique em Formatar e depois em Enviar.
          O sistema irá converter os dados automaticamente para JSON e realizar o envio para o Renova.

          Na opção Buscar Matrícula, o sistema consulta e retorna a matrícula já existente no Renova."
      />
      </main>
    </div>
  );
};

export default Formatadores2;
