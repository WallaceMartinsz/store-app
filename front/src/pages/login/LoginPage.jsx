import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, session, loginAdmin, loginVisitor, registerVisitor } = useAuth();
  const [mode, setMode] = useState(location.state?.mode || 'visitor');
  const [visitorAction, setVisitorAction] = useState('register');
  const [visitorForm, setVisitorForm] = useState({ name: '', email: '', phone: '', quantity: 0 });
  const [adminForm, setAdminForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const destination = location.state?.from || (mode === 'admin' ? '/admin' : '/');

  if (session) {
    return <Navigate to={isAdmin ? '/admin' : '/profile'} replace />;
  }

  const handleVisitorChange = (event) => {
    const { name, value } = event.target;
    setVisitorForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const handleAdminChange = (event) => {
    const { name, value } = event.target;
    setAdminForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const handleVisitorSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError('');

      if (visitorAction === 'register') {
        await registerVisitor(visitorForm);
      } else {
        await loginVisitor({ email: visitorForm.email });
      }

      navigate(location.state?.from || '/profile');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Nao foi possivel entrar como visitante.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError('');
      await loginAdmin(adminForm);
      navigate(destination);
    } catch (requestError) {
      setError('Usuario ou senha de admin invalidos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-panel">
        <Link className="brand" to="/">Load<span>out</span></Link>
        <div className="page-heading">
          <h1>Entrar na loja</h1>
          <p>Escolha visitante para comprar ou admin para gerenciar estoque e vendas.</p>
        </div>

        <div className="segmented-control">
          <button className={mode === 'visitor' ? 'is-active' : ''} type="button" onClick={() => setMode('visitor')}>
            Visitante
          </button>
          <button className={mode === 'admin' ? 'is-active' : ''} type="button" onClick={() => setMode('admin')}>
            Admin
          </button>
        </div>

        {error && <p className="feedback feedback--error">{error}</p>}

        {mode === 'visitor' ? (
          <form className="auth-form" onSubmit={handleVisitorSubmit}>
            <div className="segmented-control segmented-control--small">
              <button
                className={visitorAction === 'register' ? 'is-active' : ''}
                type="button"
                onClick={() => setVisitorAction('register')}
              >
                Cadastrar
              </button>
              <button
                className={visitorAction === 'login' ? 'is-active' : ''}
                type="button"
                onClick={() => setVisitorAction('login')}
              >
                Ja tenho cadastro
              </button>
            </div>

            {visitorAction === 'register' && (
              <label>
                Nome
                <input name="name" value={visitorForm.name} onChange={handleVisitorChange} />
              </label>
            )}

            <label>
              E-mail
              <input name="email" type="email" value={visitorForm.email} onChange={handleVisitorChange} />
            </label>

            {visitorAction === 'register' && (
              <label>
                Telefone
                <input name="phone" value={visitorForm.phone} onChange={handleVisitorChange} />
              </label>
            )}

            <button className="button" type="submit" disabled={loading}>
              {loading ? 'Entrando...' : 'Continuar como visitante'}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleAdminSubmit}>
            <label>
              Usuario
              <input name="username" value={adminForm.username} onChange={handleAdminChange} />
            </label>
            <label>
              Senha
              <input name="password" type="password" value={adminForm.password} onChange={handleAdminChange} />
            </label>
            <button className="button" type="submit" disabled={loading}>
              {loading ? 'Validando...' : 'Entrar como admin'}
            </button>
          </form>
        )}
      </section>
    </main>
  );
};

export default LoginPage;
