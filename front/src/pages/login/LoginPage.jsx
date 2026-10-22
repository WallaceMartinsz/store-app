import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

// Mesmas regras do VisitorRequest/VisitorLoginRequest no backend
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 72;
const MAX_PHONE_LENGTH = 11;

const INITIAL_VISITOR_FORM = { name: '', email: '', phone: '', password: '', confirmPassword: '' };

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, session, loginAdmin, loginVisitor, registerVisitor } = useAuth();
  const [mode, setMode] = useState(location.state?.mode || 'visitor');
  const [visitorAction, setVisitorAction] = useState('register');
  const [visitorForm, setVisitorForm] = useState(INITIAL_VISITOR_FORM);
  const [adminForm, setAdminForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const destination = location.state?.from || (mode === 'admin' ? '/admin' : '/');
  const isRegister = visitorAction === 'register';

  if (session) {
    return <Navigate to={isAdmin ? '/admin' : '/profile'} replace />;
  }

  const changeVisitorAction = (action) => {
    setVisitorAction(action);
    setError('');
    setFieldErrors({});
    setVisitorForm((currentForm) => ({ ...currentForm, password: '', confirmPassword: '' }));
  };

  const handleVisitorChange = (event) => {
    const { name, value } = event.target;
    setVisitorForm((currentForm) => ({ ...currentForm, [name]: value }));
    setFieldErrors((currentErrors) => ({ ...currentErrors, [name]: undefined }));
  };

  const handleAdminChange = (event) => {
    const { name, value } = event.target;
    setAdminForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const validateVisitor = () => {
    const errors = {};

    if (visitorForm.password.length < MIN_PASSWORD_LENGTH) {
      errors.password = `A senha deve ter no minimo ${MIN_PASSWORD_LENGTH} caracteres.`;
    } else if (isRegister && visitorForm.password.length > MAX_PASSWORD_LENGTH) {
      errors.password = `A senha deve ter no maximo ${MAX_PASSWORD_LENGTH} caracteres.`;
    }

    if (isRegister && visitorForm.password !== visitorForm.confirmPassword) {
      errors.confirmPassword = 'As senhas nao conferem.';
    }

    return errors;
  };

  const handleVisitorSubmit = async (event) => {
    event.preventDefault();
    const errors = validateVisitor();

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      setLoading(true);
      setError('');
      setFieldErrors({});

      if (isRegister) {
        const { confirmPassword, ...visitor } = visitorForm;
        await registerVisitor(visitor);
      } else {
        await loginVisitor({ email: visitorForm.email, password: visitorForm.password });
      }

      navigate(location.state?.from || '/profile');
    } catch (requestError) {
      const data = requestError.response?.data;
      setFieldErrors(data?.fields || {});
      setError(data?.message || 'Nao foi possivel entrar como visitante.');
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

  const fieldError = (name) => fieldErrors[name] && <span className="field-error">{fieldErrors[name]}</span>;

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
          <form className="auth-form" onSubmit={handleVisitorSubmit} noValidate>
            <div className="segmented-control segmented-control--small">
              <button
                className={isRegister ? 'is-active' : ''}
                type="button"
                onClick={() => changeVisitorAction('register')}
              >
                Cadastrar
              </button>
              <button
                className={!isRegister ? 'is-active' : ''}
                type="button"
                onClick={() => changeVisitorAction('login')}
              >
                Ja tenho cadastro
              </button>
            </div>

            {isRegister && (
              <label>
                Nome
                <input name="name" autoComplete="name" value={visitorForm.name} onChange={handleVisitorChange} />
                {fieldError('name')}
              </label>
            )}

            <label>
              E-mail
              <input
                name="email"
                type="email"
                autoComplete="email"
                value={visitorForm.email}
                onChange={handleVisitorChange}
              />
              {fieldError('email')}
            </label>

            <label>
              Senha
              <input
                name="password"
                type="password"
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                value={visitorForm.password}
                onChange={handleVisitorChange}
              />
              {isRegister && !fieldErrors.password && (
                <span className="field-hint">Minimo de {MIN_PASSWORD_LENGTH} caracteres.</span>
              )}
              {fieldError('password')}
            </label>

            {isRegister && (
              <>
                <label>
                  Confirmar senha
                  <input
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={visitorForm.confirmPassword}
                    onChange={handleVisitorChange}
                  />
                  {fieldError('confirmPassword')}
                </label>

                <label>
                  Telefone
                  <input
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    maxLength={MAX_PHONE_LENGTH}
                    placeholder="Opcional"
                    value={visitorForm.phone}
                    onChange={handleVisitorChange}
                  />
                  {fieldError('phone')}
                </label>
              </>
            )}

            <button className="button" type="submit" disabled={loading}>
              {loading ? 'Entrando...' : isRegister ? 'Criar conta' : 'Entrar'}
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
