import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';


const VendaListagemView = () => {
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const navigate = useNavigate();
  const { authFetch } = useAuth();


  const carregarVendas = useCallback(async () => {
    try {
      setErro(null);
      setLoading(true);
      const response = await authFetch("http://localhost:5000/api/vendas");

      if (!response.ok) throw new Error("Erro ao carregar vendas");
      const data = await response.json();
      setVendas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setErro("Não foi possível carregar as vendas. Tente novamente.");
    } finally {
      setLoading(false);
    }
   }, [authFetch]);

  useEffect(() => {
    carregarVendas();
  }, [carregarVendas]);

  useEffect(() => {
    const handler = () => carregarVendas();
    window.addEventListener("atualizarVendas", handler);
    return () => window.removeEventListener("atualizarVendas", handler);
  }, [carregarVendas]);

  return (
    <div className="container py-3">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h4 m-0">Saída</h1>
        <button className="btn btn-primary" onClick={() => navigate("/vendas/nova")}>
          + Nova Saída
        </button>
      </div>

      {loading && <div className="alert alert-secondary">Carregando…</div>}
      {erro && <div className="alert alert-danger">{erro}</div>}

      {!loading && !erro && (
        <div className="card shadow-sm">
          <div className="table-responsive">
            <table className="table align-middle mb-0 tabela-produtos">
              <thead className="table-light">
                <tr>
                  <th>Produto</th>
                  <th>Código</th>
                  <th>Quantidade</th>
                  <th>Nota Fiscal</th>
                  <th>Data de saída</th>
                  <th>Cliente</th>
                  <th>Valor Unitário</th>
                  <th>Valor Total</th>
                </tr>
              </thead>
              <tbody>
                {vendas.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center text-muted py-4">
                      Nenhuma saída cadastrada.
                    </td>
                  </tr>
                ) : (
                  vendas.map((v) => {
                    const qtd = Number(v.quantidade) || 0;
                    const vu = Number(v.valor_unitario) || 0;
                    const total = qtd * vu;

                    // Campos tolerantes: se o backend ainda não envia, mostra "-"
                    return (
                      <tr key={v.id}>
                        <td>{v.produto || "-"}</td>
                        <td>{v.codigo_produto || v.codigo || "-"}</td>
                        <td>{qtd}</td>
                        <td>{v.nota_fiscal || "-"}</td>
                        <td>
                          {v.data_saida
                            ? new Date(v.data_saida).toLocaleDateString("pt-BR")
                            : v.data_entrada
                            ? new Date(v.data_entrada).toLocaleDateString("pt-BR")
                            : "-"}
                        </td>
                        <td>{v.cliente || v.cliente_nome || "-"}</td>
                        <td>
                          R{"$ "}
                          {vu.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td>
                          R{"$ "}
                          {total.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendaListagemView;
