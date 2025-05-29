const pool = require('../models/db');


exports.obterDadosDashboard = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.categoria, EXTRACT(MONTH FROM v.data_entrada) AS mes, 
             SUM(v.quantidade * v.valor_unitario) AS total
      FROM vendas v
      JOIN produtos p ON v.produto_id = p.id
      GROUP BY p.categoria, mes
    `);

    const dados = result.rows;

    const resumo = { eletronicos: 0, vestuario: 0, livros: 0 };
    const mensal = Array(12).fill(0);
    const trimestre = [];

    const mesAtual = new Date().getMonth() + 1;
    const mesesTrimestre = [mesAtual - 2, mesAtual - 1, mesAtual].map(m => (m <= 0 ? m + 12 : m));

    mesesTrimestre.forEach(mes => {
      trimestre.push({
        mes,
        eletronicos: 0,
        vestuario: 0,
        livros: 0
      });
    });

    dados.forEach(d => {
      const categoria = d.categoria;
      const mes = parseInt(d.mes);
      const total = parseFloat(d.total);

      if (resumo[categoria] !== undefined) {
        resumo[categoria] += total;
      }

      mensal[mes - 1] += total;

      trimestre.forEach(t => {
        if (t.mes === mes && t[categoria] !== undefined) {
          t[categoria] += total;
        }
      });
    });

    res.json({
      resumo,
      mensal: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        valores: mensal
      },
      trimestre
    });
  } catch (err) {
    console.error('Erro no dashboard:', err);
    res.status(500).json({ error: 'Erro ao buscar dados do dashboard.' });
  }
};
