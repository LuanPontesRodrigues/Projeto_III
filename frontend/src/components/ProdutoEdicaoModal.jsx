import React, { useState, useEffect } from 'react';
import '../styles/ProdutoCadastroModal.css';

const ProdutoEditarModal = ({ produto, onClose, onProdutoAtualizado }) => {
  const [nome, setNome] = useState('');
  const [codigo, setCodigo] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');

  useEffect(() => {
    if (produto) {
      setNome(produto.nome || '');
      setCodigo(produto.codigo || '');
      setPreco(produto.preco || '');
      setQuantidade(produto.quantidade || '');
    }
  }, [produto]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const produtoAtualizado = {
      nome,
      codigo,
      preco: parseFloat(preco),
      quantidade: parseInt(quantidade)
    };

    try {
      const response = await fetch(`http://localhost:5000/api/produtos/${produto.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produtoAtualizado),
      });

      if (response.ok) {
        onProdutoAtualizado();
        onClose();
      } else {
        alert('Erro ao atualizar produto');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao conectar com o servidor.');
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Editar produto</h2>
        <form onSubmit={handleSubmit}>
          <label>Nome do produto</label>
          <input
            placeholder="Informe"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <label>Código do produto</label>
          <input
            placeholder="Informe"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            required
          />

          <label>Preço</label>
          <input
            type="number"
            placeholder="R$ 0.00"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            required
          />

          <label>Quantidade</label>
          <input
            type="number"
            placeholder="0"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            required
          />

          <div className="botoes">
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit">Atualizar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProdutoEditarModal;
