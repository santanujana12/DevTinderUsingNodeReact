import axios from "axios";
import { IP_ADDRESS } from "../utils/constants";

export const getSuggestedUsersService = async () => {
  const response = await axios.get(IP_ADDRESS + "/user/feed", {
    withCredentials: true,
  });
  return {
    message: response.data,
    status: response.status,
  };
};
