import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/ProdutoListagem.css";

const EntradaListagemView = () => {
  const [entradas, setEntradas] = useState([]);
  const navigate = useNavigate();
  const { authFetch } = useAuth();

  useEffect(() => {
    async function carregarEntradas() {
      try {
        const res = await authFetch("http://localhost:5000/api/entrada");
        const data = await res.json();
        setEntradas(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erro ao carregar entradas:", err);
      }
    }
    carregarEntradas();
  }, [authFetch]);

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente excluir esta entrada?")) return;
    try {
      await authFetch(`http://localhost:5000/api/entrada/${id}`, { method: "DELETE" });
      setEntradas((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Erro ao excluir entrada:", err);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Entradas de Nota</h1>
        <button className="novo-produto" onClick={() => navigate("/entrada/nova")}>+ Nova Entrada</button>
      </header>

      <div className="table-responsive">
        <table className="tabela-produtos">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Fornecedor</th>
              <th>Nota Fiscal</th>
              <th>Data Entrada</th>
              <th>Qtd</th>
              <th>Valor Unitário</th>
              <th>Total</th>
              <th className="text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {entradas.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center text-muted py-4">
                  Nenhuma entrada cadastrada.
                </td>
              </tr>
            ) : (
              entradas.map((e) => (
                <tr key={e.id}>
                  <td>{e.produto}</td>
                  <td>{e.fornecedor}</td>
                  <td>{e.nota_fiscal || "-"}</td>
                  <td>{e.data_entrada ? new Date(e.data_entrada).toLocaleDateString("pt-BR") : "-"}</td>
                  <td>{e.quantidade}</td>
                  <td>R$ {(Number(e.valor_unitario) || 0).toFixed(2)}</td>
                  <td>R$ {((Number(e.quantidade) || 0) * (Number(e.valor_unitario) || 0)).toFixed(2)}</td>
                  <td className="text-center">
                    <button onClick={() => handleDelete(e.id)}>Excluir</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EntradaListagemView;

