import axios from "axios";
import { IP_ADDRESS } from "../utils/constants";

export const reviewRequestService = async (status, cardId) => {
  try {
    const response = await axios.post(
      IP_ADDRESS + `/profile/review-connection-request/${status}/${cardId}`,
      {},
      {
        withCredentials: true,
      }
    );
    return {
      message: response.data,
      status: response.status,
    };
  } catch (error) {
    console.error("Error reviewing request:", error);
    return {
      message: error.message,
      status: error.response ? error.response.status : 500,
    };
  }
};
