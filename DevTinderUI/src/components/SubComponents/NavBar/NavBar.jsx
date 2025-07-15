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
        navigate("/");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="navbar bg-base-300 shadow-sm fixed top-0 z-50 w-full">
      <div className="flex-1">
        <Link className="btn btn-ghost text-xl" to={user?"/dashboard/feed":"/"}>Tinder 💘 Clone</Link>
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
                <Link to="/dashboard/connection-info">My Connections</Link>
              </li>
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
