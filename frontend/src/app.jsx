import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ProdutoListagemView from './components/ProdutoListagemView';
import './styles/Layout.css';
import DashboardEstoque from './components/DashboardEstoque';

const App = () => {
  return (
    <Router>
      <div className="main-content">
  <Routes>
    <Route path="/" element={<ProdutoListagemView />} />
    <Route path="/dashboard" element={<DashboardEstoque />} />
  </Routes>
</div>

    </Router>
  );
};

export default App;
