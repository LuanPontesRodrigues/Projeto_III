import React from "react";
import { Modal, Button } from "react-bootstrap";

const ProdutoExclusaoModal = ({ produto, onClose, onConfirmar }) => {
  const handleDelete = () => {
    onConfirmar(produto.id);
  };

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Excluir produto</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        Tem certeza que deseja excluir o produto <b>{produto.nome}</b>?
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Excluir
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProdutoExclusaoModal;
