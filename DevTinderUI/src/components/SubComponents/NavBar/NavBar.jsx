import { Link, useNavigate } from "react-router-dom";
import { LogoutService } from "../../../service/AuthService";
import { toast, ToastContainer } from "react-toastify";




export const NavBar = () => {
  const navigate = useNavigate();

  const handleLogout=async()=>{
    const response = await LogoutService();
    if(response===true){
      toast.success("Logged Out Successfully");
      navigate("/login");
    }else{
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="navbar bg-base-300 shadow-sm">
      <div className="flex-1">
        <Link className="btn btn-ghost text-xl">Tinder💘 Clone</Link>
      </div>
      <div className="mx-4">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <Link onClick={()=>handleLogout()}>Logout</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
