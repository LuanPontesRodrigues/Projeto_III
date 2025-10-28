import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAuth } from '../context/AuthContext';

const FornecedorEdicaoModal = ({ fornecedor, onClose, onFornecedorAtualizado }) => {
  const [nome, setNome] = useState(fornecedor?.nome || "");
  const [cnpj, setCnpj] = useState(fornecedor?.cnpj || "");
  const [telefone, setTelefone] = useState(fornecedor?.telefone || "");
  const { authFetch } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await authFetch(`http://localhost:5000/api/fornecedores/${fornecedor.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, cnpj, telefone }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar fornecedor");
      }

      if (typeof onFornecedorAtualizado === "function") {
        onFornecedorAtualizado();
      }
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar fornecedor:", error);
      alert(error.message || "Erro ao atualizar fornecedor");
    }
  };

  return (
    <Modal show onHide={onClose} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Editar fornecedor</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>CNPJ</Form.Label>
            <Form.Control
              type="text"
              value={cnpj}
              onChange={(event) => setCnpj(event.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-0">
            <Form.Label>Telefone</Form.Label>
            <Form.Control
              type="text"
              value={telefone}
              onChange={(event) => setTelefone(event.target.value)}
              required
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Salvar alterações
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default FornecedorEdicaoModal;
