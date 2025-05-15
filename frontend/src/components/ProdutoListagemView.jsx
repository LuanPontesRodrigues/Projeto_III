import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ProdutoCadastroModal from './ProdutoCadastroModal';
import '../styles/ProdutoListagem.css';
import ProdutoExclusaoModal from './ProdutoExclusaoModal';
import ProdutoEdicaoModal from './ProdutoEdicaoModal';


const ProdutoListagemView = () => {
  const [produtos, setProdutos] = useState([]);
  const [pesquisa, setPesquisa] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [produtoParaExcluir, setProdutoParaExcluir] = useState(null);
  const [produtoParaEditar, setProdutoParaEditar] = useState(null);



  const carregarProdutos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/produtos');
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

 const ExcluirPoduto = async (id) => {
  try {
    await fetch(`http://localhost:5000/api/produtos/${id}`, {
      method: "DELETE",
    });
    carregarProdutos(); // atualiza a listagem
    setProdutoParaExcluir(null);
  } catch (error) {
    console.error("Erro ao excluir produto", error);
  }
};


  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <header className="header">
          <h1>Listagem de Produto</h1>
          <button className="novo-produto" onClick={() => setMostrarModal(true)}>
            + Novo produto
          </button>
        </header>

        <div className="filtros">
          <input
            type="text"
            placeholder="Pesquisar Produto"
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
          />
        </div>

        <table className="tabela-produtos">
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
                  <button onClick={() => setProdutoParaExcluir(produto)}>🗑️</button>
                  <button onClick={() => setProdutoParaEditar(produto)}>✏️</button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>

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
            onConfirmar={(id) => ExcluirPoduto(id)}
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
          
      </div>
    </div>
  );
};

export default ProdutoListagemView;
