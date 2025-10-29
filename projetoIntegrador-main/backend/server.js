const express = require('express');
const cors = require('cors');
const app = express();

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const produtoRotaRoutes = require('./routes/produtoRotaRoutes');
const vendasRoutes = require('./routes/vendas');
const dashboardRoutes = require('./routes/dashboard');
const fornecedorRoutes = require('./routes/fornecedorRoutes');
const ClientesRoutes = require('./routes/clientesRoutes');
const EntradaRoutes = require('./routes/entradaRoutes');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/produtos', productRoutes);
app.use('/api/produtos-em-rota', produtoRotaRoutes);
app.use('/api/vendas', vendasRoutes);
app.use('/api', dashboardRoutes);
app.use('/api/fornecedores', fornecedorRoutes);
app.use('/api/clientes', ClientesRoutes);
app.use('/api/entrada', EntradaRoutes);

app.listen(5000, () => {
  console.log('Servidor rodando na porta 5000');
});