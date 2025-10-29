import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';



const VendasFormView = () => {
  const [produtos, setProdutos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const { authFetch } = useAuth(); 

  const [form, setForm] = useState({
    produto_id: "",
    codigo_produto: "",
    quantidade: "",
    nota_fiscal: "",
    data_saida: "",
    valor_unitario: "",
    valor_total: "",
    cliente_id: "",
  });

  const navigate = useNavigate();

  // Carrega produtos e clientes
  useEffect(() => {
    (async () => {
      try {
        const [rp, rc] = await Promise.all([
          authFetch("http://localhost:5000/api/produtos"),
          authFetch("http://localhost:5000/api/clientes"),
        ]);
        const [prodData, cliData] = await Promise.all([rp.json(), rc.json()]);
        setProdutos(Array.isArray(prodData) ? prodData : []);
        setClientes(Array.isArray(cliData) ? cliData : []);
      } catch (e) {
        console.error(e);
        alert("Falha ao carregar produtos/clientes");
      }
    })();
}, [authFetch]);

  // Produto selecionado
  const produtoSel = useMemo(
    () => produtos.find((p) => String(p.id) === String(form.produto_id)),
    [produtos, form.produto_id]
  );

  // Preenche código e valor unitário ao escolher produto
  useEffect(() => {
    if (produtoSel) {
      setForm((f) => ({
        ...f,
        codigo_produto: produtoSel.codigo ?? "",
        valor_unitario: produtoSel.preco ?? "",
      }));
    } else {
      setForm((f) => ({ ...f, codigo_produto: "", valor_unitario: "" }));
    }
  }, [produtoSel]);

  // Calcula valor total
  useEffect(() => {
    const q = Number(form.quantidade) || 0;
    const vu = Number(form.valor_unitario) || 0;
    const total = q * vu;
    setForm((f) => ({ ...f, valor_total: total ? total.toFixed(2) : "" }));
  }, [form.quantidade, form.valor_unitario]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!form.produto_id || !form.quantidade) {
      alert("Selecione o produto e informe a quantidade.");
      return;
    }

    try {
      // Payload compatível com seu back-end atual (campos extras irão juntos, sem quebrar)
      const payload = {
        produto_id: Number(form.produto_id),
        quantidade: Number(form.quantidade),
        valor_unitario: Number(form.valor_unitario) || undefined,
        // campos adicionais (opcionais, para quando você evoluir o backend):
        nota_fiscal: form.nota_fiscal || undefined,
        data_saida: form.data_saida || undefined,
        cliente_id: form.cliente_id ? Number(form.cliente_id) : undefined,
      };

        const res = await authFetch("http://localhost:5000/api/vendas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Erro ao registrar venda");

      window.dispatchEvent(new Event("atualizarDashboard"));
      window.dispatchEvent(new Event("atualizarVendas"));
      alert("Venda registrada com sucesso!");
      navigate("/vendas");
    } catch (err) {
      console.error(err);
      alert(err.message || "Falha ao registrar venda");
    }
  };

  return (
    <div className="container py-3">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h4 m-0">Saída</h1>
        <button className="btn btn-outline-secondary" onClick={() => navigate("/vendas")}>
          Voltar
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <form className="row g-3" onSubmit={onSubmit}>
            {/* Produto */}
            <div className="col-12 col-md-4">
              <label className="form-label">Produto</label>
              <select
                className="form-select"
                name="produto_id"
                value={form.produto_id}
                onChange={onChange}
                required
              >
                <option value="">Selecione</option>
                {produtos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Código do produto (auto) */}
            <div className="col-12 col-md-4">
              <label className="form-label">Código do produto</label>
              <input
                className="form-control"
                name="codigo_produto"
                value={form.codigo_produto}
                placeholder="0000-00"
                disabled
              />
            </div>

            {/* Quantidade */}
            <div className="col-12 col-md-4">
              <label className="form-label">Quantidade da saída</label>
              <input
                type="number"
                min="1"
                className="form-control"
                name="quantidade"
                value={form.quantidade}
                onChange={onChange}
                placeholder="0"
                required
              />
            </div>

            {/* Nota Fiscal */}
            <div className="col-12 col-md-4">
              <label className="form-label">Nota Fiscal</label>
              <input
                className="form-control"
                name="nota_fiscal"
                value={form.nota_fiscal}
                onChange={onChange}
                placeholder="0000.000-00"
              />
            </div>

            {/* Data de saída */}
            <div className="col-12 col-md-4">
              <label className="form-label">Data de saída</label>
              <input
                type="date"
                className="form-control"
                name="data_saida"
                value={form.data_saida}
                onChange={onChange}
              />
            </div>

            {/* Valor unitário (auto do produto, editável se quiser) */}
            <div className="col-12 col-md-4">
              <label className="form-label">Valor unitário</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                name="valor_unitario"
                value={form.valor_unitario}
                onChange={onChange}
                placeholder="Informe"
              />
            </div>

            {/* Cliente */}
            <div className="col-12 col-md-4">
              <label className="form-label">Cliente</label>
              <select
                className="form-select"
                name="cliente_id"
                value={form.cliente_id}
                onChange={onChange}
              >
                <option value="">Selecione</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Valor Total (auto) */}
            <div className="col-12 col-md-4">
              <label className="form-label">Valor Total</label>
              <input
                className="form-control"
                name="valor_total"
                value={form.valor_total}
                disabled
                placeholder="Calculado"
              />
            </div>

            <div className="col-12 d-flex gap-2 mt-2">
              <button className="btn btn-primary" type="submit">
                Salvar
              </button>
              <button className="btn btn-outline-secondary" type="button" onClick={() => navigate("/vendas")}>
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
