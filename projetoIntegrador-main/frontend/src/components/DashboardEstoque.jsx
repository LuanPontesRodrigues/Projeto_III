import React, { useEffect, useMemo, useState } from 'react';
import '../styles/DashboardEstoque.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import { useAuth } from '../context/AuthContext';

ChartJS.register(BarElement, CategoryScale, LinearScale, PointElement);

const DashboardEstoque = () => {
  const [vendas, setVendas] = useState([]);
  const [estoque, setEstoque] = useState([]);
  const [filtroVendas, setFiltroVendas] = useState('mes'); // 'dia' | 'mes' | 'ano'
  const [limiarEstoque, setLimiarEstoque] = useState(50);
  const { authFetch } = useAuth();

  useEffect(() => {
    let ativo = true;
    const carregar = async () => {
      try {
        const [resVendas, resEstoque] = await Promise.all([
          authFetch('http://localhost:5000/api/vendas'),
          authFetch('http://localhost:5000/api/produtos/estoque'),
        ]);
        if (resVendas.ok) {
          const dataV = await resVendas.json();
          if (ativo) setVendas(Array.isArray(dataV) ? dataV : []);
        }
        if (resEstoque.ok) {
          const dataE = await resEstoque.json();
          if (ativo) setEstoque(Array.isArray(dataE) ? dataE : []);
        }
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
      }
    };

    carregar();
    const handler = () => carregar();
    window.addEventListener('atualizarDashboard', handler);
    return () => {
      ativo = false;
      window.removeEventListener('atualizarDashboard', handler);
    };
  }, [authFetch]);

  const cores = {
    azul: '#4FC3F7',
    verde: '#81C784',
    laranja: '#FFB74D',
  };

  const windowForFilter = (tipo) => {
    const now = new Date();
    if (tipo === 'dia') { const past = new Date(); past.setDate(now.getDate() - 29); return past; }
    if (tipo === 'mes') { const past = new Date(); past.setMonth(now.getMonth() - 11); return past; }
    if (tipo === 'ano') { const past = new Date(); past.setFullYear(now.getFullYear() - 4); return past; }
    return new Date(0);
  };

  const vendasAgrupadas = useMemo(() => {
    const inicio = windowForFilter(filtroVendas);
    const mapa = new Map();
    for (const v of vendas) {
      const d = v.data_entrada || v.data_venda;
      const dt = new Date(d);
      if (Number.isNaN(dt.getTime()) || dt < inicio) continue;
      const chave =
        filtroVendas === 'dia'
          ? dt.toLocaleDateString('pt-BR')
          : filtroVendas === 'mes'
          ? `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`
          : String(dt.getFullYear());
      const total = (Number(v.quantidade) || 0) * (Number(v.valor_unitario) || 0);
      mapa.set(chave, (mapa.get(chave) || 0) + total);
    }
    const labels = Array.from(mapa.keys()).sort((a, b) => a.localeCompare(b));
    const valores = labels.map((k) => mapa.get(k));
    return { labels, valores };
  }, [vendas, filtroVendas]);

  const estoqueBaixo = useMemo(() => {
    const limiar = Number(limiarEstoque) || 0;
    const items = (estoque || []).filter((p) => (Number(p.quantidade) || 0) < limiar);
    return items.slice(0, 12);
  }, [estoque, limiarEstoque]);

  const topVendidos = useMemo(() => {
    const inicio = windowForFilter(filtroVendas);
    const porProduto = new Map();
    for (const v of vendas) {
      const d = v.data_entrada || v.data_venda;
      const dt = new Date(d);
      if (Number.isNaN(dt.getTime()) || dt < inicio) continue;
      const nome = v.produto || 'Produto';
      porProduto.set(nome, (porProduto.get(nome) || 0) + (Number(v.quantidade) || 0));
    }
    return Array.from(porProduto.entries())
      .map(([nome, qtd]) => ({ nome, qtd }))
      .sort((a, b) => b.qtd - a.qtd)
      .slice(0, 10);
  }, [vendas, filtroVendas]);

  return (
    <div className="dashboard-layout">
      <div className="dashboard-content">
        

        <div className="graficos-container">
          <div className="grafico-barras">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0 }}>Vendas por período</h3>
              <div>
                <button className={`btn btn-sm ${filtroVendas === 'dia' ? 'btn-primary' : 'btn-outline-primary'} me-2`} onClick={() => setFiltroVendas('dia')}>Dia</button>
                <button className={`btn btn-sm ${filtroVendas === 'mes' ? 'btn-primary' : 'btn-outline-primary'} me-2`} onClick={() => setFiltroVendas('mes')}>Mês</button>
                <button className={`btn btn-sm ${filtroVendas === 'ano' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setFiltroVendas('ano')}>Ano</button>
              </div>
            </div>
            <div className="chart-area">
            <Bar
              data={{
                labels: vendasAgrupadas.labels,
                datasets: [{ label: 'Vendas (R$)', data: vendasAgrupadas.valores, backgroundColor: cores.azul }]
              }}
              options={{ plugins: { legend: { display: true } }, responsive: true, maintainAspectRatio: false }}
            />
            </div>
          </div>

          <div className="grafico-barras">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0 }}>Itens com estoque baixo</h3>
              <div className="input-group input-group-sm" style={{ width: 180 }}>
                <span className="input-group-text">Limiar</span>
                <input type="number" min={0} value={limiarEstoque} onChange={(e) => setLimiarEstoque(e.target.value)} className="form-control" />
              </div>
            </div>
            <div className="chart-area">
            <Bar
              data={{
                labels: estoqueBaixo.map((p) => p.nome),
                datasets: [{ label: 'Quantidade', data: estoqueBaixo.map((p) => p.quantidade), backgroundColor: cores.laranja }]
              }}
              options={{ plugins: { legend: { display: false } }, responsive: true, maintainAspectRatio: false }}
            />
            </div>
          </div>

          <div className="grafico-barras">
            <h3>Top produtos vendidos (período)</h3>
            <div className="chart-area">
            <Bar
              data={{
                labels: topVendidos.map((i) => i.nome),
                datasets: [{ label: 'Quantidade', data: topVendidos.map((i) => i.qtd), backgroundColor: cores.verde }]
              }}
              options={{ plugins: { legend: { display: false } }, responsive: true, maintainAspectRatio: false }}
            />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardEstoque;

