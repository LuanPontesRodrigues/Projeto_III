import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EntradaFormView = () => {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [entrada, setEntrada] = useState({
    produto_id: "",
    fornecedor_id: "",
    nota_fiscal: "",
    data_entrada: "",
    quantidade: "",
    valor_unitario: "",
  });

  useEffect(() => {
    // Carregar produtos e fornecedores do backend (ajustado para porta 5000)
    fetch("http://localhost:5000/api/produtos")
      .then((res) => res.json())
      .then(setProdutos)
      .catch((err) => console.error("Erro ao carregar produtos:", err));

    fetch("http://localhost:5000/api/fornecedores")
      .then((res) => res.json())
      .then(setFornecedores)
      .catch((err) => console.error("Erro ao carregar fornecedores:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEntrada((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/entrada", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entrada),
      });

      if (!response.ok) throw new Error("Erro ao salvar entrada");

      alert("Entrada registrada com sucesso!");
      navigate("/entrada"); // volta pra listagem
    } catch (err) {
      console.error(err);
      alert("Erro ao registrar entrada");
    }
  };

  return (
    <div className="custom-container">
      <h2 className="custom-title">Registrar Nova Entrada</h2>

      <form className="custom-form" onSubmit={handleSubmit}>
        <div className="custom-form-group">
          <label>Produto:</label>
          <select
            name="produto_id"
            value={entrada.produto_id}
            onChange={handleChange}
            required
          >
            <option value="">Selecione um produto</option>
            {produtos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="custom-form-group">
          <label>Fornecedor:</label>
          <select
            name="fornecedor_id"
            value={entrada.fornecedor_id}
            onChange={handleChange}
            required
          >
            <option value="">Selecione um fornecedor</option>
            {fornecedores.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="custom-form-group">
          <label>Nota Fiscal:</label>
          <input
            type="text"
            name="nota_fiscal"
            value={entrada.nota_fiscal}
            onChange={handleChange}
          />
        </div>

        <div className="custom-form-group">
          <label>Data de Entrada:</label>
          <input
            type="date"
            name="data_entrada"
            value={entrada.data_entrada}
            onChange={handleChange}
            required
          />
        </div>

        <div className="custom-form-group">
          <label>Quantidade:</label>
          <input
            type="number"
            name="quantidade"
            value={entrada.quantidade}
            onChange={handleChange}
            required
          />
        </div>

        <div className="custom-form-group">
          <label>Valor Unitário:</label>
          <input
            type="number"
            step="0.01"
            name="valor_unitario"
            value={entrada.valor_unitario}
            onChange={handleChange}
            required
          />
        </div>

        <div className="custom-buttons">
          <button type="submit" className="custom-btn custom-btn-save">
            Salvar Entrada
          </button>
          <button
            type="button"
            className="custom-btn custom-btn-cancel"
            onClick={() => navigate("/entrada")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EntradaFormView;
