import React, { useState, useEffect } from "react";
import FornecedorCadastroModal from "./FornecedorCadastroModal";
import FornecedorExclusaoModal from "./FornecedorExclusaoModal";
import FornecedorEdicaoModal from "./FornecedorEdicaoModal";
import "../styles/ProdutoListagem.css";
import { useAuth } from '../context/AuthContext'; 

const FornecedorListagemView = () => {
  const [fornecedores, setFornecedores] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [fornecedorParaExcluir, setFornecedorParaExcluir] = useState(null);
  const [fornecedorParaEditar, setFornecedorParaEditar] = useState(null);
  const { authFetch } = useAuth();

  const carregarFornecedores = async () => {
    try {
      const response = await authFetch("http://localhost:5000/api/fornecedores");
      const data = await response.json();
      setFornecedores(data);
    } catch (error) {
      console.error("Erro ao carregar fornecedores:", error);
    }
  };

  useEffect(() => {
    carregarFornecedores();
  }, []);

  const fornecedoresFiltrados = fornecedores.filter((fornecedor) =>
    (fornecedor.nome || fornecedor.nome_fornecedor)
      .toLowerCase()
      .includes(pesquisa.toLowerCase())
  );

  const excluirFornecedor = async (id) => {
    try {
      await authFetch(`http://localhost:5000/api/fornecedores/${id}`, {
        method: "DELETE",
      });
      carregarFornecedores();
      setFornecedorParaExcluir(null);
    } catch (error) {
      console.error("Erro ao excluir fornecedor", error);
    }
  };

  return (
    <div className="layout"> 
      <div className="content">
        <header className="header">
          <h1>Listagem de Fornecedores</h1>
          <button className="novo-produto" onClick={() => setMostrarModal(true)}>
            + Novo fornecedor
          </button>
        </header>

        <div className="filtros">
          <input
            type="text"
            placeholder="Pesquisar fornecedor"
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
          />
        </div>

        <table className="tabela-produtos">
          <thead>
            <tr>
              <th>Nome</th>
              <th>CNPJ</th>
              <th>Telefone</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {fornecedoresFiltrados.map((fornecedor) => (
              <tr key={fornecedor.id}>
                <td>{fornecedor.nome || fornecedor.nome_fornecedor}</td>
                <td>{fornecedor.cnpj}</td>
                <td>{fornecedor.telefone}</td>
                <td>
                  <button onClick={() => setFornecedorParaExcluir(fornecedor)}>🗑️</button>
                  <button onClick={() => setFornecedorParaEditar(fornecedor)}>✏️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {mostrarModal && (
          <FornecedorCadastroModal
            onClose={() => setMostrarModal(false)}
            onFornecedorCadastrado={carregarFornecedores}
          />
        )}

        {fornecedorParaExcluir && (
          <FornecedorExclusaoModal
            fornecedor={fornecedorParaExcluir}
            onClose={() => setFornecedorParaExcluir(null)}
            onConfirmar={excluirFornecedor}
          />
        )}

        {fornecedorParaEditar && (
          <FornecedorEdicaoModal
            fornecedor={fornecedorParaEditar}
            onClose={() => setFornecedorParaEditar(null)}
            onFornecedorAtualizado={carregarFornecedores}
          />
        )}
      </div>
    </div>
  );
};

export default FornecedorListagemView;
