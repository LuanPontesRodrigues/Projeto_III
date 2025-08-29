import React from "react";
import "../styles/ProdutoExclusaoModal.css";

const FornecedorExclusaoModal = ({ fornecedor, onClose, onConfirmar }) => {
  return (
    <div className="exclusao-modal-overlay">
      <div className="exclusao-modal">
        <div className="exclusao-modal-icon">
          <span>❗</span>
        </div>
        <h2>
          Certeza que deseja excluir <strong>{fornecedor.nome || fornecedor.nome_fornecedor}</strong>?
        </h2>
        <p>Ao excluir um fornecedor, essa ação será permanente e não poderá ser desfeita.</p>
        <div className="exclusao-modal-actions">
          <button className="cancelar" onClick={onClose}>Cancelar</button>
          <button className="deletar" onClick={() => onConfirmar(fornecedor.id)}>Deletar</button>
        </div>
      </div>
    </div>
  );
};

export default FornecedorExclusaoModal;
