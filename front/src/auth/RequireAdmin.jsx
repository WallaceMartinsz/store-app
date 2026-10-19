import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const RequireAdmin = () => {
  const { isAdmin } = useAuth();
  const location = useLocation();

  if (!isAdmin) {
    return <Navigate to="/login" replace state={{ from: location.pathname, mode: 'admin' }} />;
  }

  return <Outlet />;
};

export default RequireAdmin;
