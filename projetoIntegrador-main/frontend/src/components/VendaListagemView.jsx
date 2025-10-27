import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const VendaListagemView = () => {
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const navigate = useNavigate();

  const carregarVendas = useCallback(async () => {
    try {
      setErro(null);
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/vendas");
      if (!response.ok) throw new Error("Erro ao carregar vendas");
      const data = await response.json();
      setVendas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setErro("Não foi possível carregar as vendas. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarVendas();
  }, [carregarVendas]);

  // Recarrega automaticamente quando o formulário disparar o evento
  useEffect(() => {
    const handler = () => carregarVendas();
    window.addEventListener("atualizarVendas", handler);
    return () => window.removeEventListener("atualizarVendas", handler);
  }, [carregarVendas]);

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h4 m-0">Listagem de Vendas</h1>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/vendas/nova")}
        >
          + Nova venda
        </button>
      </div>

      {/* Estado de carregamento */}
      {loading && (
        <div className="d-flex align-items-center gap-2 text-muted">
          <div className="spinner-border spinner-border-sm" role="status" />
          <span>Carregando…</span>
        </div>
      )}

      {/* Erro */}
      {erro && (
        <div className="alert alert-danger" role="alert">
          {erro}
        </div>
      )}

      {/* Tabela */}
      {!loading && !erro && (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Produto</th>
                <th scope="col">Quantidade</th>
                <th scope="col">Valor Unitário (R$)</th>
                <th scope="col">Valor Total (R$)</th>
                <th scope="col">Data da Venda</th>
              </tr>
            </thead>
            <tbody>
              {vendas.length > 0 ? (
                vendas.map((venda) => {
                  const valorUnit = Number(venda.valor_unitario) || 0;
                  const qtd = Number(venda.quantidade) || 0;
                  const total = qtd * valorUnit;
                  const dt = venda.data_entrada
                    ? new Date(venda.data_entrada).toLocaleDateString("pt-BR")
                    : "-";

                  return (
                    <tr key={venda.id}>
                      <td>{venda.id}</td>
                      <td>{venda.produto}</td>
                      <td>{qtd}</td>
                      <td>{valorUnit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                      <td>{total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                      <td>{dt}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    Nenhuma venda cadastrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VendaListagemView;
