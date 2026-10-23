import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import Brand from '../../components/ui/brand';
import Button from '../../components/ui/button';
import { Feedback } from '../../components/ui/feedback';
import { Field, Input } from '../../components/ui/input';
import { PageHeading } from '../../components/ui/page-heading';
import SegmentedControl from '../../components/ui/segmented-control';

const MODE_OPTIONS = [
  { value: 'visitor', label: 'Visitante' },
  { value: 'admin', label: 'Admin' }
];

const VISITOR_ACTION_OPTIONS = [
  { value: 'register', label: 'Cadastrar' },
  { value: 'login', label: 'Ja tenho cadastro' }
];

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
    return <Navigate to={isAdmin ? '/admin' : '/'} replace />;
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

      navigate(location.state?.from || '/');
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

  return (
    <main className="grid min-h-screen place-items-center bg-background p-6">
      <section className="w-[min(100%,460px)] animate-fade-up rounded-xl border border-line bg-surface p-8">
        <Brand size="lg" className="mb-6 block" />
        <PageHeading
          title="Entrar na loja"
          description="Escolha visitante para comprar ou admin para gerenciar estoque e vendas."
        />

        <SegmentedControl className="mb-5" options={MODE_OPTIONS} value={mode} onChange={setMode} />

        {error && <Feedback variant="error">{error}</Feedback>}

        {mode === 'visitor' ? (
          <form key="visitor" className="grid animate-swap-in gap-3.5" onSubmit={handleVisitorSubmit} noValidate>
            <SegmentedControl
              className="mb-2"
              options={VISITOR_ACTION_OPTIONS}
              value={visitorAction}
              onChange={changeVisitorAction}
            />

            {isRegister && (
              <Field label="Nome" error={fieldErrors.name}>
                <Input name="name" autoComplete="name" value={visitorForm.name} onChange={handleVisitorChange} />
              </Field>
            )}

            <Field label="E-mail" error={fieldErrors.email}>
              <Input
                name="email"
                type="email"
                autoComplete="email"
                value={visitorForm.email}
                onChange={handleVisitorChange}
              />
            </Field>

            <Field
              label="Senha"
              error={fieldErrors.password}
              hint={isRegister && `Minimo de ${MIN_PASSWORD_LENGTH} caracteres.`}
            >
              <Input
                name="password"
                type="password"
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                value={visitorForm.password}
                onChange={handleVisitorChange}
              />
            </Field>

            {isRegister && (
              <>
                <Field label="Confirmar senha" error={fieldErrors.confirmPassword}>
                  <Input
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={visitorForm.confirmPassword}
                    onChange={handleVisitorChange}
                  />
                </Field>

                <Field label="Telefone" error={fieldErrors.phone}>
                  <Input
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    maxLength={MAX_PHONE_LENGTH}
                    placeholder="Opcional"
                    value={visitorForm.phone}
                    onChange={handleVisitorChange}
                  />
                </Field>
              </>
            )}

            <Button type="submit" disabled={loading}>
              {loading ? 'Entrando...' : isRegister ? 'Criar conta' : 'Entrar'}
            </Button>
          </form>
        ) : (
          <form key="admin" className="grid animate-swap-in gap-3.5" onSubmit={handleAdminSubmit}>
            <Field label="Usuario">
              <Input name="username" value={adminForm.username} onChange={handleAdminChange} />
            </Field>
            <Field label="Senha">
              <Input name="password" type="password" value={adminForm.password} onChange={handleAdminChange} />
            </Field>
            <Button type="submit" disabled={loading}>
              {loading ? 'Validando...' : 'Entrar como admin'}
            </Button>
          </form>
        )}
      </section>
    </main>
  );
};

export default LoginPage;
