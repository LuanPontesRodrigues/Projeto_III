// src/components/DashboardEstoque.jsx
import React, { useEffect, useState } from 'react';
import '../styles/DashboardEstoque.css';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, BarElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement);

const DashboardEstoque = () => {
  const [dados, setDados] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/dashboard') // Ajuste a URL conforme sua rota
      .then(res => res.json())
      .then(data => setDados(data));
  }, []);

  if (!dados) return <div>Carregando...</div>;

  return (
    <div className="dashboard-container">
      {/* Cards de resumo */}
      <div className="summary-cards">
        <div className="card eletrônicos">Eletrônicos <span>R$ {dados.resumo.eletronicos}</span></div>
        <div className="card vestuario">Vestuário <span>R$ {dados.resumo.vestuario}</span></div>
        <div className="card livros">Livros <span>R$ {dados.resumo.livros}</span></div>
      </div>

      {/* Gráfico de linha */}
      <div className="grafico-linha">
        <h3>Faturamento Mensal</h3>
        <Line
          data={{
            labels: dados.mensal.labels,
            datasets: [{
              label: 'Faturamento (R$)',
              data: dados.mensal.valores,
              borderColor: '#4FC3F7',
              backgroundColor: 'rgba(79, 195, 247, 0.2)',
              tension: 0.4,
            }]
          }}
        />
      </div>

      {/* Gráfico de barras */}
      <div className="grafico-barras">
        <h3>Vendas dos Últimos 3 Meses</h3>
        <Bar
          data={{
            labels: ['Eletrônicos', 'Vestuário', 'Livros'],
            datasets: dados.trimestre.map((cat, index) => ({
              label: `Mês ${cat.mes}`,
              data: [cat.eletronicos, cat.vestuario, cat.livros],
              backgroundColor: ['#4FC3F7', '#81C784', '#FFB74D'][index],
            }))
          }}
        />
      </div>
    </div>
  );
};

export default DashboardEstoque;
