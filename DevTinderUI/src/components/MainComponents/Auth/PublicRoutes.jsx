import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

export const PublicRoutes = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (isAuthenticated) {
        return <Navigate to="/dashboard/feed" state={{ from: location.pathname }} replace />;
    }
    return children;
};
