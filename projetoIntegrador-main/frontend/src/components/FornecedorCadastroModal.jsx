import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAuth } from '../context/AuthContext';

const FornecedorCadastroModal = ({ onClose, onFornecedorCadastrado }) => {
  const [nome, setNome] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [telefone, setTelefone] = useState("");
  const { authFetch } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fornecedor = { nome, cnpj, telefone };

    try {
      const response = await authFetch("http://localhost:5000/api/fornecedores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fornecedor),
      });

      if (response.ok) {
        onFornecedorCadastrado(); // recarrega a lista
        onClose(); // fecha modal
      } else {
        alert("Erro ao cadastrar fornecedor");
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
          <Modal.Title>Cadastrar novo Fornecedor</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nome do fornecedor</Form.Label>
            <Form.Control
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>CNPJ</Form.Label>
            <Form.Control
              type="text"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              required
            />
          </Form.Group>

            <Form.Group className="mb-3">
            <Form.Label>Telefone</Form.Label>
            <Form.Control
              type="text"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              required
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Cadastrar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default FornecedorCadastroModal;
