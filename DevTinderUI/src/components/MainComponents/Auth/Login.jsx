import { useState } from "react";
import { LoginService } from "../../../service/AuthService";

export const Login = () => {
  const [userCreds, setUserCreds] = useState({
    emailId: "",
    password: "",
  });

  

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
          <button className="btn btn-primary" onClick={()=>LoginService(userCreds)}>Login</button>
        </div>
      </div>
    </div>
  );
};
