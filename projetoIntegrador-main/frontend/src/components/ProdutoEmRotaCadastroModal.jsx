import React, { useEffect, useState } from "react";
import { Modal, Form, Button, Alert, Spinner } from "react-bootstrap";

const initialFormState = () => ({
  produto_id: "",
  quantidade: 1,
  destino: "",
  data_envio: new Date().toISOString().slice(0, 10),
  observacao: "",
});

const ProdutoEmRotaCadastroModal = ({ show, onClose, onCadastrado }) => {
  const [produtos, setProdutos] = useState([]);
  const [formData, setFormData] = useState(initialFormState());
  const [loadingProdutos, setLoadingProdutos] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    if (!show) return;

    const carregarProdutos = async () => {
      setLoadingProdutos(true);
      setErro(null);
      try {
        const response = await fetch("http://localhost:5000/api/produtos");
        if (!response.ok) throw new Error("Não foi possível carregar os produtos.");
        const data = await response.json();
        setProdutos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        setErro("Erro ao carregar produtos disponíveis.");
      } finally {
        setLoadingProdutos(false);
      }
    };

    carregarProdutos();
    setFormData(initialFormState());
  }, [show]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    setErro(null);
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        quantidade: Number(formData.quantidade),
      };

      const response = await fetch("http://localhost:5000/api/produtos-em-rota", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Erro ao registrar produto em rota.");
      }

      if (typeof onCadastrado === "function") {
        onCadastrado();
      }
      setFormData(initialFormState());
    } catch (error) {
      console.error(error);
      setErro(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Registrar produto em rota</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {erro && <Alert variant="danger">{erro}</Alert>}

          <Form.Group className="mb-3" controlId="produtoEmRotaProduto">
            <Form.Label>Produto</Form.Label>
            <Form.Select
              name="produto_id"
              value={formData.produto_id}
              onChange={handleChange}
              required
              disabled={loadingProdutos}
            >
              <option value="">Selecione um produto</option>
              {produtos.map((produto) => (
                <option key={produto.id} value={produto.id}>
                  {produto.nome} (Disponíveis: {produto.quantidade})
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="produtoEmRotaQuantidade">
            <Form.Label>Quantidade</Form.Label>
            <Form.Control
              type="number"
              min={1}
              name="quantidade"
              value={formData.quantidade}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="produtoEmRotaDestino">
            <Form.Label>Destino</Form.Label>
            <Form.Control
              type="text"
              name="destino"
              placeholder="Informe o cliente ou local de destino"
              value={formData.destino}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="produtoEmRotaData">
            <Form.Label>Data de envio</Form.Label>
            <Form.Control
              type="date"
              name="data_envio"
              value={formData.data_envio}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-0" controlId="produtoEmRotaObservacao">
            <Form.Label>Observações</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="observacao"
              value={formData.observacao}
              onChange={handleChange}
              placeholder="Informações adicionais sobre o envio"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={submitting || loadingProdutos}>
            {submitting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Salvando...
              </>
            ) : (
              "Salvar"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ProdutoEmRotaCadastroModal;
