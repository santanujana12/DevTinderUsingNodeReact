import { useState } from "react";
import { RegistrationService } from "../../../service/AuthService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserService } from "../../../service/UserService";
import { useDispatch } from "react-redux";
import { addUser } from "../../../store/slices/userSlice";

export const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userCreds, setUserCreds] = useState({
    firstName: "",
    lastName: "",
    date_of_birth: "",
    gender: "",
    emailId: "",
    password: "",
    photoUrl: "",
    skills: [],
  });

  const handleRegistration = async (userCreds) => {
    const response = await RegistrationService(userCreds);

    if (response.status === 200) {
      toast.success(response.message);
      navigate("/login");
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div className="flex justify-center my-10">
      <div className="card bg-base-100 w-96 shadow-lg border-1">
        <div className="card-body">
          <h2 className="card-title justify-center">Sign Up</h2>
          <label className="form-control w-full max-w-xs my-2">
            <span className="label label-text">FirstName:</span>
            <input
              type="text"
              placeholder="First Name"
              value={userCreds.firstName}
              className="input input-bordered w-full max-w-xs my-2"
              onChange={(e) =>
                setUserCreds({ ...userCreds, firstName: e.target.value })
              }
            />
          </label>

          <label className="form-control w-full max-w-xs my-2">
            <span className="label label-text">LastName:</span>
            <input
              type="text"
              placeholder="Last Name"
              value={userCreds.lastName}
              className="input input-bordered w-full max-w-xs my-2"
              onChange={(e) =>
                setUserCreds({ ...userCreds, lastName: e.target.value })
              }
            />
          </label>

          <label className="form-control w-full max-w-xs my-2">
            <span className="label label-text">Email ID:</span>
            <input
              type="email"
              placeholder="Email ID"
              value={userCreds.emailId}
              className="input input-bordered w-full max-w-xs my-2"
              onChange={(e) =>
                setUserCreds({ ...userCreds, emailId: e.target.value })
              }
            />
          </label>

          <label className="form-control w-full max-w-xs my-2">
            <span className="label label-text">Password:</span>
            <input
              type="password"
              placeholder="Password"
              value={userCreds.password}
              className="input input-bordered w-full max-w-xs my-2"
              onChange={(e) =>
                setUserCreds({ ...userCreds, password: e.target.value })
              }
            />
          </label>

          <label className="form-control w-full max-w-xs my-2">
            <span className="label label-text">Gender:</span>
            <select
              defaultValue="Select Age"
              className="select input input-bordered w-full max-w-xs my-2"
              onChange={(e) =>
                setUserCreds({ ...userCreds, gender: e.target.value })
              }
            >
              <option disabled={true}>Select gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </label>

          <label className="form-control w-full max-w-xs my-2">
            <span className="label label-text">Date of Birth:</span>
            <input
              type="date"
              value={userCreds.date_of_birth}
              className="input input-bordered w-full max-w-xs my-2"
              onChange={(e) =>
                setUserCreds({ ...userCreds, date_of_birth: e.target.value })
              }
            />
          </label>

          <label className="form-control w-full max-w-xs my-2">
            <span className="label label-text">Photo URL:</span>
            <input
              type="text"
              placeholder="Enter photo URL"
              value={userCreds.photoUrl}
              className="input input-bordered w-full max-w-xs my-2"
              onChange={(e) =>
                setUserCreds({ ...userCreds, photoUrl: e.target.value })
              }
            />
          </label>

          <label className="form-control w-full max-w-xs my-2">
            <span className="label label-text">Skills:</span>
            <input
              type="text"
              placeholder="Enter comma separated skills"
              value={userCreds.skills}
              className="input input-bordered w-full max-w-xs my-2"
              onChange={(e) =>
                setUserCreds({ ...userCreds, skills: e.target.value })
              }
            />
          </label>
        </div>
        <div className="card-actions justify-end m-4">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/login")}
          >
            Click to Login
          </button>
          <button
            className="btn btn-success"
            onClick={() => handleRegistration(userCreds)}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};
