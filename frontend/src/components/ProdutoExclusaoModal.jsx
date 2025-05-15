import React from "react";
import "../styles/ProdutoExclusaoModal.css";

const ProdutoExclusaoModal = ({ produto, onConfirmar, onClose }) => {
  return (
    <div className="exclusao-modal-overlay">
      <div className="exclusao-modal">
        <div className="exclusao-modal-icon">
          <span>❗</span>
        </div>
        <h2>
          Certeza que deseja excluir <strong>{produto.nome}</strong>?
        </h2>
        <p>Ao excluir um produto, essa ação será permanente e não poderá ser desfeita.</p>
        <div className="exclusao-modal-actions">
          <button className="cancelar" onClick={onClose}>Cancel</button>
          <button className="deletar" onClick={() => onConfirmar(produto.id)}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default ProdutoExclusaoModal;
