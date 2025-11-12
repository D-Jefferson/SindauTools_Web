import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login/login";
import Home from "./pages/Home/home";
import Formatadores from "./pages/Formatadores/formatadores";
import Sobre from "./pages/Sobre/sobre";
import FiltroCPF from "./pages/Filtrocpf/filtrocpf";
import Ajuda from "./pages/Ajuda/ajuda";
import TokenButton from "./api/autorizacao";

function AppContent() {
  const location = useLocation();
  const mostrarBotao = ["/ferramentas", "/matricula", "/notificacao"].includes(
    location.pathname
  );

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/ferramentas" element={<Formatadores />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/filtrocpf" element={<FiltroCPF />} />
        <Route path="/ajuda" element={<Ajuda />} />
      </Routes>
      {mostrarBotao && <TokenButton />}
      <ToastContainer position="top-right" autoClose={2500} theme="dark" />
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
