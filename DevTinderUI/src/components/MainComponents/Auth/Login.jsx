import { useState } from "react";
import { LoginService } from "../../../service/AuthService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserService } from "../../../service/UserService";
import { useDispatch } from "react-redux";
import { addUser } from "../../../store/slices/userSlice";

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userCreds, setUserCreds] = useState({
    emailId: "",
    password: "",
  });

  const handleLogin = async (userCreds) => {
    const response = await LoginService(userCreds);

    if (response.status === 200) {
      toast.success(response.message);
      const profileResponse = await UserService();
      if (profileResponse) {
        dispatch(addUser(profileResponse.message));
      } else {
        toast.error("Error fetching profile");
      }
      navigate("/dashboard/feed");
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div className="flex justify-center py-20">
      <div className="card bg-base-100 w-96 shadow-lg border-1">
        <div className="card-body">
          <h2 className="card-title justify-center">Login</h2>
          <label className="form-control w-full max-w-xs my-2">
            <span className="label label-text">Email ID:</span>
            <input
              type="text"
              value={userCreds.emailId}
              className="input input-bordered w-full max-w-xs my-2"
              onChange={(e) =>
                setUserCreds({ ...userCreds, emailId: e.target.value })
              }
            />
          </label>
          <label className="form-control w-full max-w-xs my-2">
            <span className="label label-text">Password</span>
            <input
              type="password"
              value={userCreds.password}
              className="input input-bordered w-full max-w-xs my-2"
              onChange={(e) =>
                setUserCreds({ ...userCreds, password: e.target.value })
              }
            />
          </label>
        </div>
        <div className="card-actions m-4">
          <div>
            <button className="btn btn-info" onClick={() => navigate("/sign-up")}>
              Forgot Password?
            </button>
          </div>
          <div className="card-actions justify-end">
            <button className="btn btn-info" onClick={() => navigate("/sign-up")}>
              Sign Up
            </button>
            <button
              className="btn btn-primary"
              onClick={() => handleLogin(userCreds)}
            >
              Login
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
