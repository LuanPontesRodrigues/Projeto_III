import React, { useState } from "react";
import "../styles/ProdutoCadastroModal.css"; // reaproveitando CSS do produto

const FornecedorCadastroModal = ({ onClose, onFornecedorCadastrado }) => {
  const [nome, setNome] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [telefone, setTelefone] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fornecedor = { nome, cnpj, telefone };

    try {
      const response = await fetch("http://localhost:5000/api/fornecedores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fornecedor),
      });

      if (response.ok) {
        onFornecedorCadastrado(); // recarrega a lista
        onClose(); // fecha modal
      } else {
        alert("Erro ao cadastrar fornecedor");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Cadastrar novo Fornecedor</h2>
        <form onSubmit={handleSubmit}>
          <label>Nome do Fornecedor</label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <label>CNPJ</label>
          <input
            value={cnpj}
            onChange={(e) => setCnpj(e.target.value)}
            required
          />

          <label>Telefone</label>
          <input
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            required
          />

          <div className="botoes">
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit">Cadastrar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FornecedorCadastroModal;
