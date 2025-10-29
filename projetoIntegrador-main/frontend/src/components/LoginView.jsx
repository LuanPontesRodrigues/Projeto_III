import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

const LoginView = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        const { error } = await response.json().catch(() => ({ error: 'Não foi possível autenticar.' }));
        setErro(error || 'Não foi possível autenticar.');
        return;
      }

      const data = await response.json();
      login(data);
    } catch (error) {
      console.error('Falha ao realizar login:', error);
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

          <h1 className="login-title">Log in</h1>
          <p className="login-subtitle">Boas-vindas de volta!</p>

          <form className="login-form" onSubmit={handleSubmit}>
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
              placeholder="Informe sua senha"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              autoComplete="current-password"
              required
            />

            <div className="login-actions">
              <a className="login-forgot" href="#">Esqueceu a senha</a>
            </div>

            {erro && <div className="login-error">{erro}</div>}

            <button type="submit" className="login-submit" disabled={carregando}>
              {carregando ? 'Entrando...' : 'Acessar'}
            </button>
          </form>

          <p className="login-footer">
            Ainda não tem uma conta?{' '}
            <Link to="/registrar">Registre-se</Link>
          </p>
        </section>

        <aside className="login-illustration" aria-hidden="true">
          <div className="login-illustration-content">
            <h2>Gestão de estoque sem complicação</h2>
            <p>Mantenha o controle total da sua operação com painéis intuitivos e fluxo simples.</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default LoginView;