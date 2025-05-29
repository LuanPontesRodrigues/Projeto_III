import React from 'react';
import { Link } from 'react-router-dom'; // Importa o Link para navegação SPA
import '../styles/Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      {/* Área da logo */}
      <div className="logo">
        <img src="/logo.png" alt="Logo" />
      </div>

      {/* Menu lateral com seções */}
      <nav className="menu">
        <ul>
          {/* Seção Listagem */}
          <li className="menu-title">Listagem
            <ul>
              <li><Link to="/" className="submenu-item">Produto</Link></li>
              <li><Link to="/fornecedor" className="submenu-item">Fornecedor</Link></li>
              <li><Link to="/cliente" className="submenu-item">Cliente</Link></li>
            </ul>
          </li>

          {/* Seção Estoque */}
          <li className="menu-title">
            <Link to="/dashboard" className="submenu-item">Estoque</Link>
          </li>
        </ul>
      </nav>

      {/* Rodapé com botão de logout */}
      <div className="logout">
        <button>Encerrar Sessão</button>
      </div>
    </aside>
  );
};

export default Sidebar;
