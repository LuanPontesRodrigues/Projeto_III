import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ProdutoListagemView from './components/ProdutoListagemView';
import './styles/Layout.css';
import DashboardEstoque from './components/DashboardEstoque';
import FornecedorListagemView from "./components/FornecedorListagemView";
import ClienteListagemView from './components/ClienteListagemView';

const App = () => {
  return (
    <Router>
      <div className="main-content">
  <Routes>
    <Route path="/" element={<ProdutoListagemView />} />
    <Route path="/dashboard" element={<DashboardEstoque />} />
    <Route path="/fornecedor" element={<FornecedorListagemView />} />
    <Route path="/clientes" element={<ClienteListagemView />} />
  </Routes>
</div>

    </Router>
  );
};

export default App;
