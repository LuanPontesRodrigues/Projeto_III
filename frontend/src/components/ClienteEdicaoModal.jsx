import React, { useState, useEffect } from "react";
import "../styles/ProdutoCadastroModal.css";

const ClienteEditarModal = ({ cliente, onClose, onClienteAtualizado }) => {
  const [nome, setNome] = useState("");
  const [tipoCliente, setTipoCliente] = useState("cpf");
  const [cpf, setCpf] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [endereco, setEndereco] = useState("");
  const [complemento, setComplemento] = useState("");
  const [telefone, setTelefone] = useState("");

  useEffect(() => {
    if (cliente) {
      setNome(cliente.nome || "");
      setTipoCliente(cliente.tipoCliente || "cpf");
      setCpf(cliente.cpf || "");
      setCnpj(cliente.cnpj || "");
      setEndereco(cliente.endereco || "");
      setComplemento(cliente.complemento || "");
      setTelefone(cliente.telefone || "");
    }
  }, [cliente]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const clienteAtualizado = {
      nome,
      tipoCliente,
      cpf: tipoCliente === "cpf" ? cpf : null,
      cnpj: tipoCliente === "cnpj" ? cnpj : null,
      endereco,
      complemento,
      telefone,
    };

    try {
      const response = await fetch(`http://localhost:5000/api/clientes/${cliente.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clienteAtualizado),
      });

      if (response.ok) {
        onClienteAtualizado();
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
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Editar cliente</h2>
        <form onSubmit={handleSubmit}>
          <label>Nome</label>
          <input value={nome} onChange={(e) => setNome(e.target.value)} required />

          <label>Tipo de Cliente</label>
          <select value={tipoCliente} onChange={(e) => setTipoCliente(e.target.value)}>
            <option value="cpf">Pessoa Física (CPF)</option>
            <option value="cnpj">Pessoa Jurídica (CNPJ)</option>
          </select>

          {tipoCliente === "cpf" && (
            <>
              <label>CPF</label>
              <input maxLength={11} value={cpf} onChange={(e) => setCpf(e.target.value)} />
            </>
          )}

          {tipoCliente === "cnpj" && (
            <>
              <label>CNPJ</label>
              <input maxLength={14} value={cnpj} onChange={(e) => setCnpj(e.target.value)} />
            </>
          )}

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
