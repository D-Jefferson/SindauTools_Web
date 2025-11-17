import { toast } from "react-toastify";

declare global {
  interface Window {
    tokenGlobal?: string;
  }
}

export async function getapi(): Promise<void> {
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
    const response = await fetch(
      `https://teleaulaapi-prod.renova.app.br/api/Matricula/BuscarMatricula?cpf=${cpf}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.tokenGlobal}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(response.status.toString());
    }

    const data = await response.json();
    console.log("Dados da matrícula:", data);

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
      "Observação: Os dados são enviados diretamente da API oficial da Renova, por meio de requisições autenticadas, conforme autorização do gestor Nadson Hugo.";
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

