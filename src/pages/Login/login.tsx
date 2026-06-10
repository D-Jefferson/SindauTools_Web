import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDemo } from "../../context/demo";
import { login, setToken } from "../../api/Sindauto/autenticacao";
import "./login.css";
import { fmtCpf } from "../../utils/formatos";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setIsDemo } = useDemo();
  const [cpf, setCpf]         = useState("");
  const [senha, setSenha]     = useState("");
  const [erro, setErro]       = useState("");
  const [loading, setLoading] = useState(false);
  const [verSenha, setVerSenha] = useState(false);

  const entrarDemo = () => {
    setIsDemo(true);
    navigate("/home");
  };

  // ── Login ──────────────────────────────────────────────────────────
  const entrar = async () => { setErro("");
    const cpfRaw = cpf.replace(/\D/g, "");
    if (cpfRaw.length < 11) { setErro("Informe um CPF válido."); return; }
    if (!senha)              { setErro("Informe a senha.");       return; }

    setLoading(true);
    try {
      const token = await login({ username: cpfRaw, password: senha });
      setToken(token);
      sessionStorage.setItem("mostrar-modal-update", "true");
      navigate("/home");
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Usuário ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="pagina-login">

        {/* ── Conteúdo principal ── */}
        <div className="conteudo-principal">
          <div className="container-login">
            <div className="cabecalho-login">
              <div className="icone-login">
                <div className="circulo-icone">
                  <i
                    className="fas fa-right-to-bracket"
                    style={{ fontSize: 28, color: "var(--brand-red)" }}
                  ></i>
                </div>
              </div>
              <h1>Acesso ao Sistema</h1>
              <p>Insira suas credenciais para continuar</p>
            </div>

            <div className="campos-login">
              <input
                className="input-login"
                type="text"
                placeholder="CPF"
                value={cpf}
                onChange={(e) => setCpf(fmtCpf(e.target.value))}
                onKeyDown={(e) => e.key === "Enter" && entrar()}
                maxLength={14}
                autoComplete="username"
              />
              <div style={{ position: "relative" }}>
                <input
                  className="input-login"
                  type={verSenha ? "text" : "password"}
                  placeholder="Senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && entrar()}
                  autoComplete="current-password"
                  style={{ paddingRight: "2.5rem", width: "100%" }}
                />
                <i
                  className={`fas ${verSenha ?  "fa-eye" : "fa-eye-slash"}`}
                  onClick={() => setVerSenha(!verSenha)}
                  style={{
                    position: "absolute",
                    right: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    color: "var(--brand-red)",
                  }}
                />
              </div>
            </div>

            <button className="botao" onClick={entrar} disabled={loading}>
              {loading
                ? <><i className="fas fa-circle-notch fa-spin"></i>&nbsp;ENTRANDO...</>
                : "ENTRAR"
              }
            </button>
            <button
              className="botao"
              style={{ marginTop: "0.75rem", background: "transparent", border: "1px solid var(--brand-red)", color: "var(--brand-red)" }}
              onClick={entrarDemo}
            >
              <i className="fas fa-flask" /> MODO DEMONSTRAÇÃO
            </button>

            <div className="rodape-login">
              © 2025 Jefferson Levy. Todos os direitos reservados.
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default LoginPage;