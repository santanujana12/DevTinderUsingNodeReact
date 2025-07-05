import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getSuggestedUsersService } from "../../../service/getUserFeedService";
import { addSuggestedUsers } from "../../../store/slices/suggestedUserSlice";
import { removeUser } from "../../../store/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { SuggestiveUserCards } from "./suggestiveUserCards";

export const UserFeed = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const suggestedUsers = useSelector((state) => state.suggestedUsers);
  const [cardCount, setCardCount] = useState(0);

  const fetchSuggestedUsers = useCallback(async () => {
    try {
      const response = await getSuggestedUsersService();
      if (response.status === 200) {
        setCardCount(0);
        dispatch(addSuggestedUsers(response.message));
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

  return (
    <div>
      {console.log(suggestedUsers.length)}
      {suggestedUsers.length > 0 &&
        suggestedUsers.map((eachUserDetails, index) => {
          if (index === cardCount) {
            return (
              <SuggestiveUserCards
                key={eachUserDetails.id}
                eachUserDetails={eachUserDetails}
                setCardCount={setCardCount}
              />
            );
          }
        })}
    </div>
  );
};
