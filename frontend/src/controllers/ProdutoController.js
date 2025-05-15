// Controlador responsável por gerenciar as operações dos produtos (buscar, adicionar, etc.)

import { Produto } from '../models/ProdutoModel';

// Simula dados iniciais (mock de banco de dados temporário)
const produtosMock = [
  new Produto(1, 'Produto 1', '000.001-00'),
  new Produto(2, 'Produto 2', '000.002-00'),
  new Produto(3, 'Produto 3', '000.003-00'),
];

// Exporta funções para a view usar

// Função para listar todos os produtos
export const listarProdutos = () => {
  return produtosMock;
};

// Função para adicionar um novo produto
export const adicionarProduto = (produto) => {
  produtosMock.push(produto);
};

// Função para excluir um produto pelo ID
export const excluirProduto = (id) => {
  const index = produtosMock.findIndex(produto => produto.id === id);
  if (index !== -1) {
    produtosMock.splice(index, 1);
  }
};

// Função para buscar produtos pelo nome (filtro de pesquisa)
export const buscarProdutos = (nome) => {
  return produtosMock.filter(produto => 
    produto.nome.toLowerCase().includes(nome.toLowerCase())
  );
};
