import React from "react";
import "../styles/ProdutoExclusaoModal.css"; // Reaproveitando estilo

const ClienteExclusaoModal = ({ cliente, onConfirmar, onClose }) => {
  return (
    <div className="exclusao-modal-overlay">
      <div className="exclusao-modal">
        <div className="exclusao-modal-icon">
          <span>❗</span>
        </div>
        <h2>
          Certeza que deseja excluir <strong>{cliente.nome}</strong>?
        </h2>
        <p>Ao excluir um cliente, essa ação será permanente e não poderá ser desfeita.</p>
        <div className="exclusao-modal-actions">
          <button className="cancelar" onClick={onClose}>Cancelar</button>
          <button className="deletar" onClick={() => onConfirmar(cliente.id)}>Excluir</button>
        </div>
      </div>
    </div>
  );
};

export default ClienteExclusaoModal;
