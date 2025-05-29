const express = require('express');
const cors = require('cors');
const app = express();

const productRoutes = require('./routes/productRoutes');
const vendasRoutes = require('./routes/vendas');
const dashboardRoutes = require('./routes/dashboard');

app.use(cors());
app.use(express.json());

app.use('/api/produtos', productRoutes);
app.use('/api/vendas', vendasRoutes);
app.use('/api', dashboardRoutes);

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
