import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getActiveUserConnectionService } from "../../../service/getActiveUserConnectionService";
import { UserConnectionCards } from "./UserConnectionCards";
import { UserMessageCard } from "./UserMessageCards";
import { Link } from "react-router-dom";

export const UserConnections = () => {
  const [userConnections, setUserConnections] = useState(null);
  const [activeUserCard, setActiveUserCard] = useState(null);

  const fetchUserConnections = useCallback(async () => {
    try {
      const response = await getActiveUserConnectionService();
      if (response.status === 200) {
        setUserConnections(response.message);
      }
    } catch {
      toast.error("Something went wrong!");
    }
  }, []);

  useEffect(() => {
    if (!userConnections) {
      fetchUserConnections();
    }
  }, [userConnections, fetchUserConnections]);

  if(!userConnections){
    return (
      <div className="flex justify-center my-10">
        <div className="card bg-base-100 w-96 shadow-lg border-1">
          <div className="card-body">
            <h2 className="card-title justify-center">No Connections</h2>
            <p className="text-center">Please go to the <Link to="/dashboard/feed" className="text-primary">feed</Link> page and create some meaningful connections.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-500">
      <div className="card bg-base-100 w-full shadow-lg border-1 mb-4">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl font-bold">
            Your connections
          </h2>
        </div>
      </div>
      {userConnections && (
        <div className="flex flex-row gap-1">
          <div className="h-[calc(100vh-16rem)] w-1/3 bg-gray-900 rounded-md overflow-y-scroll">
            {userConnections.map((eachConnection) => {
              return (
                <UserConnectionCards
                  key={eachConnection._id}
                  eachConnection={eachConnection}
                  isActive={activeUserCard === eachConnection.id}
                  setActiveUserCard={setActiveUserCard}
                />
              );
            })}
          </div>
          {userConnections.map((eachConnection) => {
            return (
              eachConnection.id === activeUserCard && (
                <UserMessageCard
                  key={eachConnection.id}
                  eachConnection={eachConnection}
                  setActiveUserCard={setActiveUserCard}
                />
              )
            );
          })}
        </div>
      )}
    </div>
  );
};
