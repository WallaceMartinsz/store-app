import { Navigate, useParams } from 'react-router-dom';

const LegacyEditProductRedirect = () => {
  const { id } = useParams();

  return <Navigate to={`/admin/products/${id}/edit`} replace />;
};

export default LegacyEditProductRedirect;
