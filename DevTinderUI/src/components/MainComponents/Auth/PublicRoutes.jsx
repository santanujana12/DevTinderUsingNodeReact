import { Navigate } from "react-router-dom";

export const PublicRoutes = ({ children, user, navigate }) => {
    if (user) {
        return <Navigate to="/feed" state={{ from: navigate.location }} replace />;
    }
    return children;
};