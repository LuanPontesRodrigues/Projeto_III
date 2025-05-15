// Importa a biblioteca React
import React from 'react';
// Importa o arquivo de estilo da sidebar
import '../styles/Sidebar.css';

// Componente funcional da Sidebar
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
          {/* Título da seção */}
          <li className="menu-title">Listagem
            <ul>

          {/* Itens de submenu */}
          <li><a href="#" className='submenu-item'>Produto</a></li>
          <li><a href="#" className='submenu-item'>Fornecedor</a></li>
          <li><a href="#" className='submenu-item'>Cliente</a></li>
            </ul>
        </li>
          
        <ul>
            <li className="menu-title">Estoque</li>
        </ul>
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
