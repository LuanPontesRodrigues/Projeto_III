import React, { useState, useEffect } from 'react';
// Importando os componentes do React-Bootstrap
import { Container, Row, Col, Table, Button, Form, InputGroup } from 'react-bootstrap';
// Importando ícones profissionais
import { FaPlus, FaSearch, FaPencilAlt, FaTrash } from 'react-icons/fa';
// Mantendo as importações dos seus modais
import ProdutoCadastroModal from './ProdutoCadastroModal';
import ProdutoExclusaoModal from './ProdutoExclusaoModal';
import ProdutoEdicaoModal from './ProdutoEdicaoModal';
import { useAuth } from '../context/AuthContext';

// Remova a importação do CSS antigo, o Bootstrap cuidará do estilo
// import '../styles/ProdutoListagem.css';

const ProdutoListagemView = () => {
  const [produtos, setProdutos] = useState([]);
  const [pesquisa, setPesquisa] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [produtoParaExcluir, setProdutoParaExcluir] = useState(null);
  const [produtoParaEditar, setProdutoParaEditar] = useState(null);
  const { authFetch } = useAuth();

  const carregarProdutos = async () => {
    try {
      const response = await authFetch('http://localhost:5000/api/produtos');
      const data = await response.json();
      setProdutos(data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  const produtosFiltrados = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(pesquisa.toLowerCase())
  );

  const ExcluirProduto = async (id) => {
    try {
      await authFetch(`http://localhost:5000/api/produtos/${id}`, {
        method: "DELETE",
      });
      carregarProdutos(); // atualiza a listagem
      setProdutoParaExcluir(null);
    } catch (error) {
      console.error("Erro ao excluir produto", error);
    }
  };

  return (
    // Substituímos o div "layout" e "content" por um Container do Bootstrap
    <Container className="my-4">
      {/* Usamos Row e Col para um layout responsivo */}
      <Row className="align-items-center mb-4">
        <Col xs={12} md={8}>
          <h1 className="mb-3 mb-md-0">Listagem de Produto</h1>
        </Col>
        <Col xs={12} md={4} className="text-md-end">
          {/* Usamos o Button do Bootstrap */}
          <Button variant="primary" onClick={() => setMostrarModal(true)}>
            <FaPlus className="me-2" /> Novo produto
          </Button>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          {/* Usamos InputGroup para um campo de busca */}
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Pesquisar Produto"
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      {/*Tabela do React-Bootstrapresponsiva */}
      <Table striped bordered hover responsive className="tabela-produtos">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Código</th>
            <th>Preço</th> 
            <th>Quantidade</th> 
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtosFiltrados.map((produto) => (
            <tr key={produto.id}>
              <td>{produto.nome}</td>
              <td>{produto.codigo}</td>
              <td>R$ {parseFloat(produto.preco).toFixed(2)}</td> 
              <td>{produto.quantidade}</td>
              <td>
                {/* Botões de ação  */}
                <Button 
                  variant="warning" 
                  size="sm" 
                  className="me-2"
                  onClick={() => setProdutoParaEditar(produto)}
                >
                  <FaPencilAlt />
                </Button>
                <Button 
                  variant="danger" 
                  size="sm" 
                  onClick={() => setProdutoParaExcluir(produto)}
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modais*/}
      {mostrarModal && (
        <ProdutoCadastroModal
          onClose={() => setMostrarModal(false)}
          onProdutoCadastrado={carregarProdutos}
        />
        )
      }

      {produtoParaExcluir && (
        <ProdutoExclusaoModal
          produto={produtoParaExcluir}
          onClose={() => setProdutoParaExcluir(null)}
          onConfirmar={(id) => ExcluirProduto(id)}
        />
        )
      }

      {produtoParaEditar && (
        <ProdutoEdicaoModal
          produto={produtoParaEditar}
          onClose={() => setProdutoParaEditar(null)}
          onProdutoAtualizado={carregarProdutos}
        />
        )
      }
    </Container>
  );
};

export default ProdutoListagemView;