// App.tsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login/login";
import Home from "./pages/Home/home";
import Formatadores from "./pages/Formatadores/formatadores";
import Sobre from "./pages/Sobre/sobre";
import FiltroCPF from "./pages/Filtrocpf/filtrocpf";
import Ajuda from "./pages/Ajuda/ajuda";
import Formatadores2 from "./demo/Formatadores/formatadores";
import TokenButton from "./api/autorizacao";

function AppContent() {
  const location = useLocation();

  const mostrarBotao = ["/ferramentas"].includes(
    location.pathname
  );

  const isDemo = location.pathname.startsWith("/demo");

  useEffect(() => {
    if (isDemo) {
      document.body.classList.add("demo");
    } else {
      document.body.classList.remove("demo");
    }
  }, [isDemo]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/ferramentas" element={<Formatadores />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/filtrocpf" element={<FiltroCPF />} />
        <Route path="/ajuda" element={<Ajuda />} />
        <Route path="/demo/ferramentas" element={<Formatadores2 />} />
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
