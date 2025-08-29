import React, { useState, useEffect } from "react";
import "../styles/ProdutoCadastroModal.css";

const FornecedorEdicaoModal = ({ fornecedor, onClose, onFornecedorAtualizado }) => {
  const [nome, setNome] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [telefone, setTelefone] = useState("");

  useEffect(() => {
    if (fornecedor) {
      setNome(fornecedor.nome || fornecedor.nome_fornecedor || "");
      setCnpj(fornecedor.cnpj || "");
      setTelefone(fornecedor.telefone || "");
    }
  }, [fornecedor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fornecedorAtualizado = { nome, cnpj, telefone };

    try {
      const response = await fetch(`http://localhost:5000/api/fornecedores/${fornecedor.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fornecedorAtualizado),
      });

      if (response.ok) {
        onFornecedorAtualizado();
        onClose();
      } else {
        alert("Erro ao atualizar fornecedor");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Editar fornecedor</h2>
        <form onSubmit={handleSubmit}>
          <label>Nome do Fornecedor</label>
          <input value={nome} onChange={(e) => setNome(e.target.value)} required />

          <label>CNPJ</label>
          <input value={cnpj} onChange={(e) => setCnpj(e.target.value)} required />

          <label>Telefone</label>
          <input value={telefone} onChange={(e) => setTelefone(e.target.value)} required />

          <div className="botoes">
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit">Atualizar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FornecedorEdicaoModal;
