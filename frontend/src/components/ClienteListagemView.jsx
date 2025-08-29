import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ClienteCadastroModal from './ClienteCadastroModal';
import ClienteExclusaoModal from './ClienteExclusaoModal';
import ClienteEdicaoModal from './ClienteEdicaoModal';
import '../styles/ProdutoListagem.css';

const ClienteListagemView = () => {
  const [clientes, setClientes] = useState([]);
  const [pesquisa, setPesquisa] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [clienteParaExcluir, setClienteParaExcluir] = useState(null);
  const [clienteParaEditar, setClienteParaEditar] = useState(null);

  const carregarClientes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/clientes');
      const data = await response.json();
      setClientes(data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.nome.toLowerCase().includes(pesquisa.toLowerCase())
  );

  const excluirCliente = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/clientes/${id}`, {
        method: 'DELETE',
      });
      carregarClientes();
      setClienteParaExcluir(null);
    } catch (error) {
      console.error('Erro ao excluir cliente', error);
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <header className="header">
          <h1>Listagem de Clientes</h1>
          <button className="novo-produto" onClick={() => setMostrarModal(true)}>
            + Novo cliente
          </button>
        </header>

        <div className="filtros">
          <input
            type="text"
            placeholder="Pesquisar Cliente"
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
          />
        </div>

        <table className="tabela-produtos">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Tipo</th>
              <th>CPF / CNPJ</th>
              <th>Telefone</th>
              <th>Endereço</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {clientesFiltrados.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.nome}</td>
                <td>{cliente.tipo_cliente}</td>
                <td>{cliente.cpf || cliente.cnpj}</td>
                <td>{cliente.telefone}</td>
                <td>{cliente.endereco}</td>
                <td>
                  <button onClick={() => setClienteParaExcluir(cliente)}>🗑️</button>
                  <button onClick={() => setClienteParaEditar(cliente)}>✏️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {mostrarModal && (
          <ClienteCadastroModal
            onClose={() => setMostrarModal(false)}
            onClienteCadastrado={carregarClientes}
          />
        )}

        {clienteParaExcluir && (
          <ClienteExclusaoModal
            cliente={clienteParaExcluir}
            onClose={() => setClienteParaExcluir(null)}
            onConfirmar={(id) => excluirCliente(id)}
          />
        )}

        {clienteParaEditar && (
          <ClienteEdicaoModal
            cliente={clienteParaEditar}
            onClose={() => setClienteParaEditar(null)}
            onClienteAtualizado={carregarClientes}
          />
        )}
      </div>
    </div>
  );
};

export default ClienteListagemView;
