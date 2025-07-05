import { Link, useNavigate } from "react-router-dom";
import { LogoutService } from "../../../service/AuthService";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../../../store/slices/userSlice";

export const NavBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const handleLogout = async () => {
    try {
      const response = await LogoutService();
      if (response === true) {
        toast.success("Logged Out Successfully");
        dispatch(removeUser());
        navigate("/login");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="navbar bg-base-300 shadow-sm">
      <div className="flex-1">
        <Link className="btn btn-ghost text-xl">Tinder 💘 Clone</Link>
      </div>
      {user && (
        <div className="flex gap-2 mx-4">
          <p className="my-2 text-lg font-bold">Welcome, {user.firstName+" "+user.lastName}</p>
          <div className="dropdown dropdown-end">
            <button tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img alt="Tailwind CSS Navbar component" src={user.photoUrl} />
              </div>
            </button>
            <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
              <li>
                <Link className="justify-between">Profile</Link>
              </li>
              <li>
                <Link>Settings</Link>
              </li>
              <li>
                <Link onClick={() => handleLogout()}>Logout</Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
