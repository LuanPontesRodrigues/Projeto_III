import React, { useCallback, useEffect, useState } from "react";
import { Container, Row, Col, Table, Button, Badge } from "react-bootstrap";
import { FaPlus, FaCheckCircle, FaTrash } from "react-icons/fa";
import ProdutoEmRotaCadastroModal from "./ProdutoEmRotaCadastroModal";
import { useAuth } from '../context/AuthContext';

const formatarData = (valor) => {
  if (!valor) return "-";
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return "-";
  return data.toLocaleDateString("pt-BR");
};

const ProdutoEmRotaListagemView = () => {
  const [registros, setRegistros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const { authFetch } = useAuth();

  const carregarRegistros = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const response = await authFetch("http://localhost:5000/api/produtos-em-rota");
      if (!response.ok) throw new Error("Não foi possível carregar os produtos em rota.");
      const data = await response.json();
      setRegistros(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setErro("Erro ao carregar os produtos em rota.");
    } finally {
      setCarregando(false);
    }
  }, [authFetch]);

  useEffect(() => {
    carregarRegistros();
  }, [carregarRegistros]);

  const marcarComoRecebido = async (id) => {
    setErro(null);
    try {
      const response = await authFetch(`http://localhost:5000/api/produtos-em-rota/${id}/status`, {
        method: "PATCH",
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Erro ao atualizar status.");
      }
      carregarRegistros();
    } catch (error) {
      console.error(error);
      setErro(error.message);
    }
  };

  const removerRegistro = async (id) => {
    if (!window.confirm("Deseja realmente remover este registro?")) return;

    setErro(null);
    try {
      const response = await authFetch(`http://localhost:5000/api/produtos-em-rota/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Erro ao remover registro.");
      }
      carregarRegistros();
    } catch (error) {
      console.error(error);
      setErro(error.message);
    }
  };

  return (
    <Container className="my-4">
      <Row className="align-items-center mb-4">
        <Col xs={12} md={8}>
          <h1 className="mb-3 mb-md-0">Produtos em rota</h1>
        </Col>
        <Col xs={12} md={4} className="text-md-end">
          <Button variant="primary" onClick={() => setMostrarModal(true)}>
            <FaPlus className="me-2" /> Registrar saída
          </Button>
        </Col>
      </Row>

      {erro && (
        <div className="alert alert-danger" role="alert">
          {erro}
        </div>
      )}

      {carregando ? (
        <div className="alert alert-secondary">Carregando…</div>
      ) : (
        <Table striped bordered hover responsive className="align-middle tabela-produtos">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Código</th>
              <th>Quantidade</th>
              <th>Destino</th>
              <th>Saída</th>
              <th>Retorno</th>
              <th>Status</th>
              <th className="text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {registros.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center text-muted py-4">
                  Nenhum produto em rota cadastrado.
                </td>
              </tr>
            ) : (
              registros.map((registro) => (
                <tr key={registro.id}>
                  <td>{registro.produto_nome}</td>
                  <td>{registro.produto_codigo || "-"}</td>
                  <td>{registro.quantidade}</td>
                  <td>{registro.destino}</td>
                  <td>{formatarData(registro.data_envio)}</td>
                  <td>{formatarData(registro.data_retorno)}</td>
                  <td>
                    <Badge bg={registro.status === "Recebido" ? "success" : "warning"}>
                      {registro.status}
                    </Badge>
                  </td>
                  <td className="text-center">
                    {registro.status === "Em rota" ? (
                      <>
                        <Button
                          variant="success"
                          size="sm"
                          className="me-2"
                          onClick={() => marcarComoRecebido(registro.id)}
                        >
                          <FaCheckCircle className="me-1" /> Recebido
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removerRegistro(registro.id)}
                        >
                          <FaTrash />
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removerRegistro(registro.id)}
                      >
                        <FaTrash />
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}

      {mostrarModal && (
        <ProdutoEmRotaCadastroModal
          show={mostrarModal}
          onClose={() => setMostrarModal(false)}
          onCadastrado={() => {
            setMostrarModal(false);
            carregarRegistros();
          }}
        />
      )}
    </Container>
  );
};

export default ProdutoEmRotaListagemView;
