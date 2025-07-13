import { useSelector } from "react-redux";

export const useAuth = () => {
  const user = useSelector((state) => state.user);
  
  return {
    user,
    isAuthenticated: !!user,
    isLoading: false, // You can add loading state management here if needed
  };
};
