import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EntradaListagemView = () => {
  const [entradas, setEntradas] = useState([]);
  const navigate = useNavigate();

  // Carregar entradas do backend
  useEffect(() => {
    async function carregarEntradas() {
      try {
        const res = await fetch("http://localhost:5000/api/entrada");
        const data = await res.json();
        setEntradas(data);
      } catch (err) {
        console.error("Erro ao carregar entradas:", err);
      }
    }
    carregarEntradas();
  }, []);

  // Excluir entrada
  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente excluir esta entrada?")) return;

    try {
      await fetch(`http://localhost:5000/api/entrada/${id}`, { method: "DELETE" });
      setEntradas(entradas.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Erro ao excluir entrada:", err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-gray-700">Entradas de Nota</h1>
        <button
          onClick={() => navigate("/entrada/nova")}
          className="custom-btn custom-btn-save"
        >
          + Nova Entrada
        </button>

      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Produto</th>
              <th className="px-4 py-2 text-left">Fornecedor</th>
              <th className="px-4 py-2 text-left">Nota Fiscal</th>
              <th className="px-4 py-2 text-left">Data Entrada</th>
              <th className="px-4 py-2 text-left">Qtd</th>
              <th className="px-4 py-2 text-left">Valor Unitário</th>
              <th className="px-4 py-2 text-left">Total</th>
              <th className="px-4 py-2 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {entradas.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center text-gray-500 py-4">
                  Nenhuma entrada cadastrada.
                </td>
              </tr>
            ) : (
              entradas.map((e) => (
                <tr key={e.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{e.produto}</td>
                  <td className="px-4 py-2">{e.fornecedor}</td>
                  <td className="px-4 py-2">{e.nota_fiscal || "-"}</td>
                  <td className="px-4 py-2">
                    {new Date(e.data_entrada).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-2">{e.quantidade}</td>
                  <td className="px-4 py-2">
                    R$ {Number(e.valor_unitario).toFixed(2)}
                  </td>
                  <td className="px-4 py-2">
                    R$ {(e.quantidade * e.valor_unitario).toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleDelete(e.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      🗑️
                    </button>
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
