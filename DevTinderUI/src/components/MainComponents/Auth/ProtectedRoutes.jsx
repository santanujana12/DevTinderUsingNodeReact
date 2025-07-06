import { Navigate } from "react-router-dom";

export const ProtectedRoutes = ({ children, user, navigate }) => {
  if (!user) {
    return <Navigate to="/login" state={{ from: navigate.location }} replace />;
  }
  return children;
};
