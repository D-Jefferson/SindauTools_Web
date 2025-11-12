// src/components/Ferramentas/ModalMatricula.tsx
import React from "react";
import "./ModalMatricula.css";

interface ModalMatriculaProps {
  data: any;
  onClose: () => void;
}

const ModalMatricula: React.FC<ModalMatriculaProps> = ({ data, onClose }) => {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>DADOS COLETADOS DA RENOVA</h2>
          <button className="close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-content">
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>

        <div className="modal-footer">
          <p>
            Observação: Os dados são enviados diretamente da API oficial da
            Renova, por meio de requisições autenticadas, conforme autorização
            do gestor Nadson Hugo.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModalMatricula;
