import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

const RegisterView = () => {
  const { login } = useAuth();
  const [empresaNome, setEmpresaNome] = useState('');
  const [empresaCnpj, setEmpresaCnpj] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErro('');

    if (senha !== confirmarSenha) {
      setErro('As senhas informadas não conferem.');
      return;
    }

    setCarregando(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empresa_nome: empresaNome,
          empresa_cnpj: empresaCnpj,
          nome,
          email,
          senha,
        }),
      });

      if (!response.ok) {
        const { error } = await response.json().catch(() => ({ error: 'Não foi possível concluir o cadastro.' }));
        setErro(error || 'Não foi possível concluir o cadastro.');
        return;
      }

      const data = await response.json();
      login(data);
    } catch (error) {
      console.error('Falha ao registrar empresa:', error);
      setErro('Erro de conexão com o servidor.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <section className="login-form-section">
          <div className="login-brand">
            <img src="/Logo.png" alt="Logotipo" />
          </div>

          <h1 className="login-title">Crie sua conta</h1>
          <p className="login-subtitle">Configure a empresa e o usuário administrador.</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="empresa-nome">Nome da empresa</label>
            <input
              id="empresa-nome"
              type="text"
              placeholder="Digite o nome da empresa"
              value={empresaNome}
              onChange={(event) => setEmpresaNome(event.target.value)}
              required
            />

            <label htmlFor="empresa-cnpj">CNPJ da empresa (opcional)</label>
            <input
              id="empresa-cnpj"
              type="text"
              placeholder="Informe o CNPJ"
              value={empresaCnpj}
              onChange={(event) => setEmpresaCnpj(event.target.value)}
            />

            <label htmlFor="nome">Seu nome</label>
            <input
              id="nome"
              type="text"
              placeholder="Digite seu nome"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              required
            />

            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Informe seu e-mail"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />

            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              placeholder="Crie uma senha segura"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              autoComplete="new-password"
              required
            />

            <label htmlFor="confirmar-senha">Confirme a senha</label>
            <input
              id="confirmar-senha"
              type="password"
              placeholder="Repita a senha"
              value={confirmarSenha}
              onChange={(event) => setConfirmarSenha(event.target.value)}
              autoComplete="new-password"
              required
            />

            {erro && <div className="login-error">{erro}</div>}

            <button type="submit" className="login-submit" disabled={carregando}>
              {carregando ? 'Criando conta...' : 'Registrar'}
            </button>
          </form>

          <p className="login-footer">
            Já possui acesso? <Link to="/">Entrar</Link>
          </p>
        </section>

        <aside className="login-illustration" aria-hidden="true">
          <div className="login-illustration-content">
            <h2>Personalize o estoque da sua empresa</h2>
            <p>Cada empresa possui dados isolados, garantindo autonomia e segurança para sua operação.</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default RegisterView;
