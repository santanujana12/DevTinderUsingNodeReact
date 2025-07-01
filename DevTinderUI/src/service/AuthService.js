import axios from "axios";
import { IP_ADDRESS } from "../utils/constants";

export const LoginService = async (userCreds) => {
  return axios
    .post(IP_ADDRESS + "/auth/login", userCreds, {
      withCredentials: true,
    })
    .then((res) => {
      return { message: res.data, status: res.status };
    })
    .catch((err) => {
      return { message: err.response.data, status: err.response.status };
    });
};

export const LogoutService = async () => {
  return axios
    .get(IP_ADDRESS + "/auth/logout", {
      withCredentials: true,
    })
    .then((res) => {
      return res.status === 200;
    })
    .catch((err) => {
      console.log(err.message);
      return err;
    });
};


export const RegistrationService = async (userCreds) => {
  return axios
    .post(IP_ADDRESS + "/auth/register", userCreds, {
      withCredentials: true,
    })
    .then((res) => {
      return { message: res.data, status: res.status };
    })
    .catch((err) => {
      return { message: err.response.data, status: err.response.status };
    });
};