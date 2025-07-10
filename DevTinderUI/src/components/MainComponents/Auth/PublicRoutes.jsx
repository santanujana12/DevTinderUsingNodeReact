import { Navigate, useLocation } from "react-router-dom";

export const PublicRoutes = ({ children, user }) => {

    const location = useLocation();

    if (user) {
        return <Navigate to="/feed" state={{ from: location.pathname }} replace />;
    }
    return children;
};