import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Manutencao from "./pages/Manutencao/info";
import Login from "./pages/Login/login"; 
import Home from "./pages/Home/home";
import Ferramentas from "./pages/Formatadores/formatadores";
import Sobre from "./pages/Sobre/sobre";
import FiltroCPF from "./pages/Filtrocpf/filtrocpf";
import Ajuda from "./pages/Ajuda/ajuda";

function App() {
  const emManutencao = false;

  return (
    <Router>
      <Routes>
        {emManutencao ? (
          <Route path="*" element={<Manutencao />} />
        ) : (
          <>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/ferramentas" element={<Ferramentas />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/filtrocpf" element={<FiltroCPF />} />
            <Route path="/ajuda" element={<Ajuda />} />
          </>
        )}
      </Routes>
      <ToastContainer position="top-right" autoClose={2500} theme="dark" />
    </Router>
    
  );
}

export default App;
