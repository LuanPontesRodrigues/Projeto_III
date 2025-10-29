import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

const ClienteCadastroModal = ({ onClose, onClienteCadastrado }) => {
  const [nome, setNome] = useState("");
  const [tipoCliente, setTipoCliente] = useState("Física");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [endereco, setEndereco] = useState("");
  const [complemento, setComplemento] = useState("");
  const [telefone, setTelefone] = useState("");
  const { authFetch } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      nome,
      tipo_cliente: tipoCliente,
      cpf_cnpj: cpfCnpj,
      endereco,
      complemento,
      telefone,
    };

    try {
      const response = await authFetch("http://localhost:5000/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Erro ao cadastrar cliente.");
      }

      onClienteCadastrado?.();
      onClose?.();
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
      alert(error.message || "Falha ao conectar com o servidor.");
    }
  };

  return (
    <Modal show onHide={onClose} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Cadastrar novo Cliente</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tipo de Cliente</Form.Label>
            <Form.Select
              value={tipoCliente}
              onChange={(e) => setTipoCliente(e.target.value)}
              required
            >
              <option value="Física">Física</option>
              <option value="Jurídica">Jurídica</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{tipoCliente === "Física" ? "CPF" : "CNPJ"}</Form.Label>
            <Form.Control
              type="text"
              value={cpfCnpj}
              onChange={(e) => setCpfCnpj(e.target.value)}
              maxLength={tipoCliente === "Física" ? 11 : 14}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Endereço</Form.Label>
            <Form.Control
              type="text"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Complemento</Form.Label>
            <Form.Control
              type="text"
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-0">
            <Form.Label>Telefone</Form.Label>
            <Form.Control
              type="text"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
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

export default ClienteCadastroModal;

