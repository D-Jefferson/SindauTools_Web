import { useState } from "react";

export default function Ajuda({ titulo = "Ajuda", texto }) {
  const [aberto, setAberto] = useState(false);

  return (
    <>
      <div
        className="icone-ajuda"
        style={{zIndex:"9999"}}
        title="Ajuda"
        onClick={() => setAberto(true)}
      >
        <i className="fas fa-question"></i>
      </div>

      {aberto && (
        <div className="modal-overlay" onClick={() => setAberto(false)}>
          <div
            className="modal-ajuda"
            onClick={(e) => e.stopPropagation()}
          >
            <h4>{titulo}</h4>
            <p>{texto}</p>

            <button className="botaofiltro" style={{backgroundColor:"#6d1818"}} onClick={() => setAberto(false)}>Fechar</button>
          </div>
        </div>
      )}
    </>
  );
}
