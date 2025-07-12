import axios from "axios";
import { IP_ADDRESS } from "../utils/constants";

export const getConnectionRequestService = async () => {
  const response = await axios.get(
    IP_ADDRESS + `/user/send-connection-request/active-requests`,
    {
      withCredentials: true,
    }
  );
  return {
    message: response.data,
    status: response.status,
  };
};
