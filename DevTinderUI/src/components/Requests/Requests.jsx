import { useEffect, useState } from "react";
import { getActiveConnectionRequestService } from "../../service/getActiveConnectionRequestService";
import { reviewRequestService } from "../../service/reviewRequestService";
import { toast } from "react-toastify";

export const Requests = () => {
  const [activeRequests, setActiveRequests] = useState([]);

  const fetchActiveRequests = async () => {
    try {
      const response = await getActiveConnectionRequestService();
      setActiveRequests(response.message);
    } catch (error) {
      console.error("Error fetching active requests:", error);
      toast.error("Failed to fetch requests");
    }
  };

  useEffect(() => {
    fetchActiveRequests();
  }, []);

  const handleReviewRequest = async (status, requestId) => {
    try {
      const response = await reviewRequestService(status, requestId);
      if (response.status === 200) {
        // const filteredRequests = activeRequests.filter((eachRequest) => {
        //   return eachRequest._id !== requestId;
        // });
        // setActiveRequests(filteredRequests);
        toast.success(response.message);
        fetchActiveRequests();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error reviewing request:", error);
      toast.error("Failed to review request");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="card bg-base-100 w-full shadow-lg border-1 mb-4">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl font-bold">
            Requests
          </h2>
        </div>
      </div>
      <div className="my-5 flex flex-col items-center">
        {activeRequests.map((eachRequest) => {
          return (
            <div
              key={eachRequest.id}
              className="card bg-base-100 w-full h-48 shadow-sm flex flex-row mb-4"
            >
              <figure className="w-1/4 object-contain">
                <img
                  src={eachRequest.photoUrl}
                  alt={eachRequest.firstName + " " + eachRequest.lastName}
                  className="object-cover"
                />
              </figure>
              <div className="card-body flex flex-col justify-center p-4 w-full">
                <h2 className="card-title text-lg font-bold">
                  {eachRequest.firstName +
                    " " +
                    eachRequest.lastName +
                    ", " +
                    eachRequest.age}
                </h2>
                <p className="text-md">{eachRequest.bio}</p>
                <div className="card-actions justify-end flex flex-col mt-4">
                  <div className="flex justify-end w-full">
                    <button
                      className="btn btn-primary mr-2"
                      onClick={() =>
                        handleReviewRequest("accepted", eachRequest.id)
                      }
                    >
                      Accept
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() =>
                        handleReviewRequest("rejected", eachRequest.id)
                      }
                    >
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
