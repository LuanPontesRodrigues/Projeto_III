import React, { useState } from "react";
import "../styles/ProdutoCadastroModal.css"; // usando o mesmo CSS genérico

const ClienteCadastroModal = ({ onClose, onClienteCadastrado }) => {
  const [nome, setNome] = useState("");
  const [tipoCliente, setTipoCliente] = useState("Física"); // padrão: Física
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [endereco, setEndereco] = useState("");
  const [complemento, setComplemento] = useState("");
  const [telefone, setTelefone] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cliente = {
      nome,
      tipo_cliente: tipoCliente,
      cpf_cnpj: cpfCnpj,
      endereco,
      complemento,
      telefone,
    };

    try {
      const response = await fetch("http://localhost:5000/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cliente),
      });

      if (response.ok) {
        onClienteCadastrado();
        onClose();
      } else {
        alert("Erro ao cadastrar cliente.");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Falha ao conectar com o servidor.");
    }
  };

  return (
    <div className="custom-modal-backdrop">
      <div className="modal">
        <h2>Cadastrar Novo Cliente</h2>
        <form onSubmit={handleSubmit}>
          <label>Nome</label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <label>Tipo de Cliente</label>
          <select
            value={tipoCliente}
            onChange={(e) => setTipoCliente(e.target.value)}
            required
          >
            <option value="Física">Física</option>
            <option value="Jurídica">Jurídica</option>
          </select>

          <label>{tipoCliente === "Física" ? "CPF" : "CNPJ"}</label>
          <input
            value={cpfCnpj}
            onChange={(e) => setCpfCnpj(e.target.value)}
            maxLength={tipoCliente === "Física" ? 11 : 14}
            required
          />

          <label>Endereço</label>
          <input
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
          />

          <label>Complemento</label>
          <input
            value={complemento}
            onChange={(e) => setComplemento(e.target.value)}
          />

          <label>Telefone</label>
          <input
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />

          <div className="botoes">
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit">Cadastrar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClienteCadastroModal;
