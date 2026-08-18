import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null; // or a Loader component

  if (!user) {
    return <Navigate to="/login/employee" replace />;
  }

  return children;
};

export default ProtectedRoute;