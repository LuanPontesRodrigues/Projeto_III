import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ProdutoListagemView from './components/ProdutoListagemView';
import DashboardEstoque from './components/DashboardEstoque';
import FornecedorListagemView from "./components/FornecedorListagemView";
import ClienteListagemView from './components/ClienteListagemView';
import './styles/Layout.css';
import EntradaFormView from './components/EntradaFormView';
import EntradaListagemView from './components/EntradaListagemView';
import "./styles/custom.css";
import VendasFormView from "./components/VendasFormView";
import VendaListagemView from './components/VendaListagemView';

const App = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <Router>
      <div className="app-container d-flex">
        {/* Sidebar */}
        <Sidebar show={showSidebar} setShow={setShowSidebar} />

        {/* Conteúdo principal */}
        <main className="flex-grow-1 p-3">
          {/* Botão hambúrguer no mobile */}
          <button
            className="btn btn-outline-primary d-md-none mb-3"
            onClick={() => setShowSidebar(true)}
          >
            ☰ Menu
          </button>

          <Routes>
            <Route path="/" element={<DashboardEstoque />} /> {/* Dashboard inicial */}
            <Route path="/produtos" element={<ProdutoListagemView />} />
            <Route path="/fornecedor" element={<FornecedorListagemView />} />
            <Route path="/clientes" element={<ClienteListagemView />} />
            <Route path="/entrada" element={<EntradaListagemView />} />
            <Route path="/entrada/nova" element={<EntradaFormView />} />
            <Route path="/vendas" element={<VendaListagemView />} />
            <Route path='vendas/nova' element={<VendasFormView />} />

          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
