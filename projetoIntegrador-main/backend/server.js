const express = require('express');
const cors = require('cors');
const app = express();

const productRoutes = require('./routes/productRoutes');
const vendasRoutes = require('./routes/vendas');
const dashboardRoutes = require('./routes/dashboard');
const fornecedorRoutes = require('./routes/fornecedorRoutes');
const ClientesRoutes = require('./routes/clientesRoutes');
const EntradaRoutes = require('./routes/entradaRoutes');
const produtoRotaRoutes = require('./routes/produtoRotaRoutes');

app.use(cors());
app.use(express.json());

app.use('/api/produtos', productRoutes);
app.use('/api/vendas', vendasRoutes);
app.use('/api', dashboardRoutes);
app.use('/api/fornecedores', fornecedorRoutes);
app.use('/api/clientes', ClientesRoutes);
app.use('/api/entrada', EntradaRoutes);
app.use('/api/produtos-em-rota', produtoRotaRoutes);

app.listen(5000, () => {
  console.log('Servidor rodando na porta 5000');
});
