import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BsListTask, BsBox, BsChevronDown, BsBoxArrowRight } from 'react-icons/bs';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const [isListagemOpen, setIsListagemOpen] = useState(false);
  const [isEstoqueOpen, setIsEstoqueOpen] = useState(true);
  
  // Estado para controlar a visibilidade da barra lateral
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  return (
    <aside 
      className={`sidebar ${isSidebarHovered ? 'visible' : ''}`}
      onMouseEnter={() => setIsSidebarHovered(true)}
      onMouseLeave={() => setIsSidebarHovered(false)}
    >
      <div className="logo">
        <img src="/Logo.png" alt="Logo" />
      </div>

      <nav className="menu">
        <ul>
          <li className={`menu-item ${isListagemOpen ? 'active' : ''}`} onClick={() => setIsListagemOpen(!isListagemOpen)}>
            <div className="menu-title">
              <BsListTask className="menu-icon" />
              <span>Listagem</span>
              <BsChevronDown className={`toggle-arrow ${isListagemOpen ? 'open' : ''}`} />
            </div>
            {isListagemOpen && (
              <ul className="submenu">
                <li><Link to="/" className="submenu-item">Produto</Link></li>
                <li><Link to="/fornecedor" className="submenu-item">Fornecedor</Link></li>
                <li><Link to="/clientes" className="submenu-item">Cliente</Link></li>
              </ul>
            )}
          </li>

          <li className={`menu-item ${isEstoqueOpen ? 'active' : ''}`} onClick={() => setIsEstoqueOpen(!isEstoqueOpen)}>
            <div className="menu-title">
              <BsBox className="menu-icon" />
              <span>Estoque</span>
              <BsChevronDown className={`toggle-arrow ${isEstoqueOpen ? 'open' : ''}`} />
            </div>
            {isEstoqueOpen && (
              <ul className="submenu">
                <li><Link to="/dashboard" className="submenu-item">Consulta</Link></li>
                <li><Link to="/entrada" className="submenu-item">Entrada</Link></li>
                <li><Link to="/saida" className="submenu-item">Saida</Link></li>
              </ul>
            )}
          </li>
        </ul>
      </nav>

      <div className="logout">
        <button>
          <BsBoxArrowRight className="logout-icon" />
          <span>Encerrar Sessão</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;