import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getActiveUserConnectionService } from "../../../service/getActiveUserConnectionService";
import { UserConnectionCards } from "./UserConnectionCards";
import { UserMessageCard } from "./UserMessageCards";

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

  return (
    <div className="bg-gray-500">
      <div className="card bg-base-100 w-full shadow-lg border-1 mb-4">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl font-bold">
            Your connections
          </h2>
        </div>
      </div>
      <div className="flex flex-row gap-4">
        <div className="h-[calc(100vh-16rem)] w-1/3 bg-gray-900 rounded-md overflow-y-scroll">
          {userConnections
            ? userConnections.map((eachConnection) => {
                return (
                  <UserConnectionCards
                    key={eachConnection._id}
                    eachConnection={eachConnection}
                    isActive={activeUserCard === eachConnection.id}
                    setActiveUserCard={setActiveUserCard}
                  />
                );
              })
            : "No connections found"}
        </div>
        {userConnections
          ? userConnections.map((eachConnection) => {
              return (
                eachConnection.id === activeUserCard && (
                  <UserMessageCard
                    key={eachConnection.id}
                    eachConnection={eachConnection}
                    setActiveUserCard={setActiveUserCard}
                  />
                )
              );
            })
          : "No connections found"}
      </div>
    </div>
  );
};
