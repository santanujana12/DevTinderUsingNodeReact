import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { getSuggestedUsersService } from "../../../service/getUserFeedService";
import { removeUser } from "../../../store/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { SuggestiveUserCards } from "./suggestiveUserCards";

export const UserFeed = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [cardCount, setCardCount] = useState(0);

  const fetchSuggestedUsers = useCallback(async () => {
    try {
      const response = await getSuggestedUsersService();
      if (response.status === 200) {
        setCardCount(0);
        // dispatch(addSuggestedUsers(response.message));
        setSuggestedUsers(response.message);
      } else if (response.status === 401) {
        toast.error("Session Expired! Please login again");
        dispatch(removeUser());
        navigate("/login");
      }
    } catch {
      toast.error("Something went wrong!");
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    fetchSuggestedUsers();
  }, [fetchSuggestedUsers]);

  if (cardCount >= suggestedUsers.length) {
    return (
      <div className="flex justify-center my-20">
        <div className="card bg-base-100 w-96 shadow-lg border-1">
          <div className="card-body">
            <h2 className="card-title justify-center">Come back soon!</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center align-center h-[50%]">
      {suggestedUsers.length > 0 &&
        suggestedUsers.map((eachUserDetails, index) => {
          if (index === cardCount) {
            return (
              <div
                key={eachUserDetails.id + index}
                className="basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 border-2 border-gray-200 shadow-sm rounded-lg"
              >
                <SuggestiveUserCards
                  eachUserDetails={eachUserDetails}
                  setCardCount={setCardCount}
                />
              </div>
            );
          }
        })}
    </div>
  );
};
