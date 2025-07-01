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
    const response = await UserService();
    if (response.status === 200) {
      dispatch(addUser(response));
    } else {
      navigate("/login");
      dispatch(removeUser())
      toast.error(response.message);
    }
  }, [dispatch,navigate]);

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
