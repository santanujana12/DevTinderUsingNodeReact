import { Navigate, useLocation } from "react-router-dom";

export const ProtectedRoutes = ({ children, user }) => {
  const location = useLocation();
 
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return children;
};
