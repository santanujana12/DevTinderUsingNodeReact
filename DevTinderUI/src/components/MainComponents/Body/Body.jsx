import { useNavigate, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useCallback, useEffect } from "react";
import { addUser, removeUser } from "../../../store/slices/userSlice";
import { NavBar } from "../../SubComponents/NavBar/NavBar";
import { Footer } from "../../SubComponents/Footer/Footer";
import { ProtectedRoutes } from "../Auth/ProtectedRoutes";
import { PublicRoutes } from "../Auth/PublicRoutes";
import { UserService } from "../../../service/UserService";
import { Login } from "../Auth/Login";
import { SignUp } from "../Auth/SignUp";
import { UserFeed } from "../Feed/userFeed";
import { ConnectionInfo } from "../ConnectionInfo/connectionInfo";

export const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const fetchUserDetails = useCallback(async () => {
    try {
      const response = await UserService();
      if (response.status === 200) {
        dispatch(addUser(response.message));
      }
    } catch {
      toast.error("Session Expired! Please login again");
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
      dispatch(removeUser());
      navigate("/login");
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    if (document.cookie.includes("token") && !user) {
      fetchUserDetails();
    }
  }, [fetchUserDetails, user]);

  return (
    <>
      <NavBar />
      <Routes>
        <Route
          path="/sign-up"
          element={
            <PublicRoutes user={user}>
              <SignUp />
            </PublicRoutes>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoutes user={user}>
              <Login />
            </PublicRoutes>
          }
        />
        <Route
          path="/feed"
          element={
            <ProtectedRoutes user={user}>
              <UserFeed />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/connections"
          element={
            <ProtectedRoutes user={user}>
              <ConnectionInfo />
            </ProtectedRoutes>
          }
        />
      </Routes>
      <Footer />
    </>
  );
};
