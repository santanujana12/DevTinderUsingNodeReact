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
import { Welcome } from "../Auth/Welcome";
import { UserFeed } from "../Feed/userFeed";
import { Dashboard } from "../Dashboard/Dashboard";
import { SideNavPanel } from "../../SubComponents/SideNavPanel/SideNavPanel";
import { Requests } from "../../Requests/Requests";
import { UserConnections } from "../UserConnections/UserConnections";

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
      {user && <SideNavPanel />}
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoutes>
              <Welcome />
            </PublicRoutes>
          }
        />
        <Route
          path="/sign-up"
          element={
            <PublicRoutes>
              <SignUp />
            </PublicRoutes>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoutes>
              <Login />
            </PublicRoutes>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoutes>
              <Dashboard />
            </ProtectedRoutes>
          }
        >
          <Route index element={<UserFeed />} />
          <Route path="feed" element={<UserFeed />} />
          <Route path="requests" element={<Requests />} />
          <Route path="connections" element={<UserConnections />} />
        </Route>
      </Routes>
      <Footer />
    </>
  );
};
