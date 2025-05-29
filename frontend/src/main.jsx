// Importa a biblioteca React
import React from 'react'
// Importa o ReactDOM para renderizar a aplicação no navegador
import ReactDOM from 'react-dom/client'
// Importa a view principal (listagem de produtos)
import ProdutoListagemView from './components/ProdutoListagemView'

import DashboardEstoque from './components/DashboardEstoque'
// Importa o CSS global
import './index.css'
import App from './app'

// Cria a raiz da aplicação React e renderiza o componente principal
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Garante que o React verifique boas práticas durante o desenvolvimento */}
    <App />
  </React.StrictMode>
)
