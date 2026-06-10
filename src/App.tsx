// App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login/login";
import Home from "./pages/Home/home";
import { DemoProvider } from "./context/demo"; // <- adiciona

function AppContent() {
  const location = useLocation();
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <DemoProvider> 
      <Router>
        <AppContent />
      </Router>
    </DemoProvider>
  );
}

export default App;