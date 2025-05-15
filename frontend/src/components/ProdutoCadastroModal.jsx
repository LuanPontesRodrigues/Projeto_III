import React, { useState } from 'react';
import '../styles/ProdutoCadastroModal.css';

const ProdutoCadastroModal = ({ onClose, onProdutoCadastrado }) => {
  const [nome, setNome] = useState('');
  const [codigo, setCodigo] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const produto = { nome, codigo };

    try {
      const response = await fetch('http://localhost:5000/api/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produto),
      });

      if (response.ok) {
        onProdutoCadastrado(); // recarrega a lista
        onClose(); // fecha o modal
      } else {
        alert('Erro ao cadastrar produto');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao conectar com o servidor.');
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Cadastrar novo produto</h2>
        <form onSubmit={handleSubmit}>
          <label>Nome do produto</label>
          <input value={nome} onChange={(e) => setNome(e.target.value)} required />

          <label>Código do produto</label>
          <input value={codigo} onChange={(e) => setCodigo(e.target.value)} required />

          <div className="botoes">
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit">Cadastrar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProdutoCadastroModal;
