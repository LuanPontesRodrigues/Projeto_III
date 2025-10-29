import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAuth } from '../context/AuthContext';


const ProdutoCadastroModal = ({ onClose, onProdutoCadastrado }) => {
  const [nome, setNome] = useState("");
  const [codigo, setCodigo] = useState("");
  const { authFetch } = useAuth();


  const handleSubmit = async (e) => {
    e.preventDefault();

    const produto = { nome, codigo };

    try {
        const response = await authFetch("http://localhost:5000/api/produtos", {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produto),
      });

      if (response.ok) {
        onProdutoCadastrado(); // recarrega a lista
        onClose(); // fecha o modal
      } else {
        alert("Erro ao cadastrar produto");
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
          <Modal.Title>Cadastrar novo produto</Modal.Title>
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
          <Button variant="primary" type="submit">
            Cadastrar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ProdutoCadastroModal;
