import { useState, useEffect } from "react";
import chatService from "../../../service/ChatService";
import { BsCircleFill } from "react-icons/bs";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { Link } from "react-router-dom";

export const UserConnectionCards = ({
  eachConnection,
  isActive,
  setActiveUserCard,
  unreadCount = 0,
}) => {
  const [triggerToolTip, setTriggerToolTip] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);

  // Check online status
  useEffect(() => {
    if (chatService.isConnected) {
      setIsOnline(chatService.isUserOnline(eachConnection.id));
    }

    // Listen for online status updates
    const unsubscribe = chatService.onUserStatusUpdate((data) => {
      if (data.userId === eachConnection.id) {
        setIsOnline(data.isOnline);
        if (!data.isOnline && data.lastSeen) {
          setLastSeen(data.lastSeen);
        }
      }
    });

    return unsubscribe;
  }, [eachConnection.id]);

  const formatLastSeen = (lastSeenDate) => {
    if (!lastSeenDate) return "Offline";

    const now = new Date();
    const lastSeen = new Date(lastSeenDate);
    const diffInMinutes = Math.floor((now - lastSeen) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleCardClick = () => {
    setActiveUserCard(eachConnection.id);
  };

  return (
    <div
      className={`${
        isActive
          ? "card bg-gray-600 shadow-md flex flex-row border-b-2 m-2 hover:bg-gray-600 cursor-pointer relative"
          : "card bg-base-300 shadow-md flex flex-row border-b-2 m-2 hover:bg-gray-600 cursor-pointer relative"
      }`}
      onClick={handleCardClick}
    >
      {/* Unread message indicator */}
      {unreadCount > 0 && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold z-10">
          {unreadCount > 9 ? "9+" : unreadCount}
        </div>
      )}

      <figure className="w-1/4 object-contain relative">
        <img
          src={eachConnection.photoUrl || "https://via.placeholder.com/150"}
          alt={eachConnection.firstName + " " + eachConnection.lastName}
          className="object-cover w-full h-24 rounded-l-lg"
        />
        {/* Online status indicator */}
        <div
          className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${
            isOnline ? "bg-green-500" : "bg-gray-400"
          }`}
        >
          {isOnline && <BsCircleFill className="w-2 h-2 text-green-500" />}
        </div>
      </figure>

      <div className="card-body flex flex-col justify-center p-4 w-full">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h2 className="card-title text-lg font-bold">
              {eachConnection.firstName + " " + eachConnection.lastName}
            </h2>
            <p className="text-sm text-gray-500">
              {isOnline ? (
                <span className="text-green-500 flex items-center">
                  <BsCircleFill className="w-2 h-2 mr-1" />
                  Online
                </span>
              ) : (
                <span className="text-gray-400">
                  {formatLastSeen(lastSeen)}
                </span>
              )}
            </p>
          </div>

          {/* Options button */}
          <div className="relative">
            <button
              className="btn btn-sm btn-ghost p-1 hover:bg-gray-500"
              onClick={(e) => {
                e.stopPropagation();
                setTriggerToolTip(!triggerToolTip);
              }}
            >
              <BiDotsVerticalRounded size={16} />
            </button>

            {triggerToolTip && (
              <div className="absolute right-0 top-8 bg-base-100 rounded-box shadow-lg border z-20 w-48">
                <ul className="menu menu-sm p-2">
                  <li>
                    <Link
                      onClick={(e) => {
                        e.stopPropagation();
                        setTriggerToolTip(false);
                        // Add view profile logic here
                      }}
                    >
                      View Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={(e) => {
                        e.stopPropagation();
                        setTriggerToolTip(false);
                        // Add remove connection logic here
                      }}
                      className="text-red-500"
                    >
                      Remove Connection
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-300 mt-1 truncate">
          {eachConnection.bio || "No bio available"}
        </p>

        {/* Show skills if available */}
        {eachConnection.skills && eachConnection.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {eachConnection.skills.slice(0, 3).map((skill, index) => (
              <span key={index} className="badge badge-primary badge-xs">
                {skill}
              </span>
            ))}
            {eachConnection.skills.length > 3 && (
              <span className="badge badge-ghost badge-xs">
                +{eachConnection.skills.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
