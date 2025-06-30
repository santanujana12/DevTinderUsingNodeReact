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
        dispatch(addUser(response));
      } else {
        toast.error("Error fetching profile");
      }
      navigate("/feed");
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div className="flex justify-center my-10">
      <div className="card bg-base-100 w-96 shadow-lg border-1">
        <div className="card-body">
          <h2 className="card-title justify-center">Login</h2>
          <label className="form-control w-full max-w-xs my-2">
            <div className="label">
              <span className="label-text">Email ID:</span>
            </div>
            <input
              type="text"
              value={userCreds.email}
              className="input input-bordered w-full max-w-xs my-2"
              onChange={(e) =>
                setUserCreds({ ...userCreds, emailId: e.target.value })
              }
            />
          </label>
          <label className="form-control w-full max-w-xs my-2">
            <div className="label">
              <span className="label-text">Password</span>
            </div>
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
        <div className="card-actions justify-end m-4">
          <button
            className="btn btn-primary"
            onClick={() => handleLogin(userCreds)}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};
