import axios from "axios";
import { IP_ADDRESS } from "../utils/constants";

export const getActiveUserConnectionService = async () => {
  try {
    const response = await axios.get(
      IP_ADDRESS + `/profile/get-active-connections`,
      {
        withCredentials: true,
      }
    );

    if (response.status === 200) {
      return {
        message: response.data,
        status: response.status,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      message: error.message,
      status: error.response ? error.response.status : 500,
    };
  }
};
