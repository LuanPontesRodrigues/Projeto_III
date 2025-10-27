import React, { useState } from "react";
import '../styles/ProdutoCadastroModal.css';

const ProdutoEdicaoModal = ({ produto, onClose, onProdutoAtualizado }) => {
  const [nome, setNome] = useState(produto?.nome || "");
  const [codigo, setCodigo] = useState(produto?.codigo || "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const produtoAtualizado = { ...produto, nome, codigo };

    try {
      const response = await fetch(`http://localhost:5000/api/produtos/${produto.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produtoAtualizado),
      });

      if (response.ok) {
        onProdutoAtualizado();
        onClose();
      } else {
        alert("Erro ao atualizar produto");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao conectar com o servidor.");
    }
  };

  return (
    <Modal show onHide={onClose} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Editar produto</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nome do produto</Form.Label>
            <Form.Control
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Código do produto</Form.Label>
            <Form.Control
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              required
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="warning" type="submit">
            Salvar alterações
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ProdutoEdicaoModal;
