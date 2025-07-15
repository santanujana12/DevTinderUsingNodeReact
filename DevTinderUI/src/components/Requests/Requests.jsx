import { useEffect, useState } from "react";
import { getActiveConnectionRequestService } from "../../service/getActiveConnectionRequestService";

export const Requests = () => {
  const [activeRequests, setActiveRequests] = useState([]);

  const fetchActiveRequests = async () => {
    const response = await getActiveConnectionRequestService();
    setActiveRequests(response.message);
  };

  useEffect(() => {
    fetchActiveRequests();
  }, []);

  return (
    <div className="">
      <div className="card bg-base-100 w-96 shadow-lg border-1">
        <div className="card-body">
          <h2 className="card-title justify-center">Requests</h2>
        </div>
      </div>
      <br />
      <div className="my-5">
        {activeRequests.map((eachRequest) => {
            console.log(eachRequest)
          return (
            <div
              key={eachRequest._id}
              className="card bg-base-100 w-96 shadow-sm"
            >
              <figure>
                <img src={eachRequest.photoUrl} alt={eachRequest.firstName+" "+eachRequest.lastName} />
              </figure>
              <div className="card-body">
                <h2 className="card-title">Card Title</h2>
                <p>
                  A card component has a figure, a body part, and inside body
                  there are title and actions parts
                </p>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary">Accept</button>
                  <button className="btn btn-primary">Decline</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
