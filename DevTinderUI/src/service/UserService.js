import axios from "axios";
import { IP_ADDRESS } from "../utils/constants";

export const UserService = async () => {
  const response = await axios.get(IP_ADDRESS + "/user/view", {
    withCredentials: true,
  });

  return {
    message: response.data,
    status: response.status,
  };
};


