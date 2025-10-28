import React, { useState, useEffect } from "react";
import "../styles/ProdutoCadastroModal.css";
import { useAuth } from '../context/AuthContext';

const ClienteEditarModal = ({ cliente, onClose, onClienteAtualizado }) => {
  const [nome, setNome] = useState("");
  const [tipoCliente, setTipoCliente] = useState("Física");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [endereco, setEndereco] = useState("");
  const [complemento, setComplemento] = useState("");
  const [telefone, setTelefone] = useState("");
  const { authFetch } = useAuth();

  useEffect(() => {
    if (cliente) {
      setNome(cliente.nome || "");
      setTipoCliente(cliente.tipo_cliente || cliente.tipoCliente || "Física");
      setCpfCnpj(cliente.cpf_cnpj || cliente.cpf || cliente.cnpj || "");
      setEndereco(cliente.endereco || "");
      setComplemento(cliente.complemento || "");
      setTelefone(cliente.telefone || "");
    }
  }, [cliente]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const clienteAtualizado = {
      nome,
      tipo_cliente: tipoCliente,
      cpf_cnpj: cpfCnpj,
      endereco,
      complemento,
      telefone,
    };

    try {
      const response = await authFetch(`http://localhost:5000/api/clientes/${cliente.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clienteAtualizado),
      });

      if (response.ok) {
        if (typeof onClienteAtualizado === "function") {
          onClienteAtualizado();
        }
        onClose();
      } else {
        alert("Erro ao atualizar cliente");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className=".custom-modal-backdrop">
      <div className="modal">
        <h2>Editar cliente</h2>
        <form onSubmit={handleSubmit}>
          <label>Nome</label>
          <input value={nome} onChange={(e) => setNome(e.target.value)} required />

          <label>Tipo de Cliente</label>
          <select value={tipoCliente} onChange={(e) => setTipoCliente(e.target.value)}>
            <option value="Física">Pessoa Física (CPF)</option>
            <option value="Jurídica">Pessoa Jurídica (CNPJ)</option>
          </select>

          <label>{tipoCliente === "Física" ? "CPF" : "CNPJ"}</label>
          <input
            value={cpfCnpj}
            onChange={(e) => setCpfCnpj(e.target.value)}
            maxLength={tipoCliente === "Física" ? 11 : 14}
            required
          />

          <label>Endereço</label>
          <input value={endereco} onChange={(e) => setEndereco(e.target.value)} />

          <label>Complemento</label>
          <input value={complemento} onChange={(e) => setComplemento(e.target.value)} />

          <label>Telefone</label>
          <input value={telefone} onChange={(e) => setTelefone(e.target.value)} />

          <div className="botoes">
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit">Atualizar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClienteEditarModal;
