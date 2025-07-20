import axios from "axios";
import { IP_ADDRESS } from "../utils/constants";

export const sendConnectionRequestService = async (status,cardId) => {
  const response = await axios.post(
    IP_ADDRESS + `/profile/send-connection-request/${status}/${cardId}`,{},
    {
      withCredentials: true,
    }
  );
  return {
    message: response.data,
    status: response.status,
  };
};
