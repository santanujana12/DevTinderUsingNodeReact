import { Outlet, useNavigate } from "react-router-dom";
import { NavBar } from "../../SubComponents/NavBar/NavBar";
import { Footer } from "../../SubComponents/Footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import { UserService } from "../../../service/UserService";
import { addUser, removeUser } from "../../../store/slices/userSlice";
import { ToastContainer, toast } from "react-toastify";
import { useCallback, useEffect } from "react";

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
      <Outlet />
      <Footer />
      <ToastContainer />
    </>
  );
};
