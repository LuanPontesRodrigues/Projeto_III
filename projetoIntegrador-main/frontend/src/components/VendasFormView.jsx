import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const VendasFormView = () => {
  const [produtos, setProdutos] = useState([]);
  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [mensagem, setMensagem] = useState(null); // { tipo: "sucesso" | "erro", texto: string }
  const [salvando, setSalvando] = useState(false);
  const navigate = useNavigate();

  // Carrega produtos
  const carregarProdutos = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/produtos");
      if (!res.ok) throw new Error("Falha ao buscar produtos");
      const data = await res.json();
      setProdutos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      setMensagem({ tipo: "erro", texto: "Não foi possível carregar os produtos." });
    }
  }, []);

  useEffect(() => {
    carregarProdutos();
  }, [carregarProdutos]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem(null);

    if (!produtoId || !quantidade) {
      setMensagem({ tipo: "erro", texto: "Preencha todos os campos." });
      return;
    }

    try {
      setSalvando(true);
      const response = await fetch("http://localhost:5000/api/vendas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          produto_id: Number(produtoId),
          quantidade: Number(quantidade),
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || "Erro ao registrar venda");

      setMensagem({ tipo: "sucesso", texto: "Venda registrada com sucesso!" });
      setProdutoId("");
      setQuantidade("");

      // Atualiza dashboards e listagens que escutam esses eventos
      window.dispatchEvent(new Event("atualizarDashboard"));
      window.dispatchEvent(new Event("atualizarVendas"));

      // Volta para a listagem de vendas após breve delay (UX)
      setTimeout(() => navigate("/vendas"), 400);
    } catch (error) {
      console.error(error);
      setMensagem({ tipo: "erro", texto: error.message });
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="container py-3">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h4 m-0">Registrar Nova Venda</h1>
        <button className="btn btn-outline-secondary" onClick={() => navigate("/vendas")}>
          Voltar
        </button>
      </div>

      {/* Alertas */}
      {mensagem && (
        <div className={`alert ${mensagem.tipo === "sucesso" ? "alert-success" : "alert-danger"}`} role="alert">
          {mensagem.texto}
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">
            {/* Produto */}
            <div className="col-12">
              <label className="form-label">Produto</label>
              <select
                className="form-select"
                value={produtoId}
                onChange={(e) => setProdutoId(e.target.value)}
                required
              >
                <option value="">Selecione um produto</option>
                {produtos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome} — R$ {(Number(p.preco) || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantidade */}
            <div className="col-12 col-sm-6 col-md-4">
              <label className="form-label">Quantidade</label>
              <input
                type="number"
                min="1"
                className="form-control"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                placeholder="Quantidade vendida"
                required
              />
            </div>

            {/* Botões */}
            <div className="col-12 d-flex gap-2 mt-2">
              <button type="submit" className="btn btn-primary" disabled={salvando}>
                {salvando ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                    Salvando…
                  </>
                ) : (
                  "Registrar Venda"
                )}
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/vendas")}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
};

export default VendasFormView;
