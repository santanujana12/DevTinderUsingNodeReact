import { Outlet } from "react-router-dom";
import { NavBar } from "../../SubComponents/NavBar/NavBar";
import { Footer } from "../../SubComponents/Footer/Footer";

export const Body = () => {
  return (
    <>
      <NavBar />
      <Outlet />
      <Footer />
    </>
  );
};
