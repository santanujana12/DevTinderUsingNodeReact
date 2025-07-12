import { sendConnectionRequestService } from "../../../service/sendConnectionRequestService";
import { toast } from "react-toastify";

export const SuggestiveUserCards = ({ eachUserDetails, setCardCount }) => {

  const handleActionsOnUserCards = async (actionType, cardId) => {
    try {
      const response = await sendConnectionRequestService(
        actionType,
        cardId
      );
      if (response.status === 200) {
        toast.success(response.message);
        setCardCount((prev) => prev + 1);
      } else {
        toast.error("Unable to send connection request");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="card bg-base-100 w-full shadow-sm">
      <figure className="">
        <img
          className="w-full object-cover h-3/4"
          src={eachUserDetails.photoUrl}
          alt={eachUserDetails.firstName + " " + eachUserDetails.lastName}
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {eachUserDetails.firstName + " " + eachUserDetails.lastName}
        </h2>
        <p>
          {eachUserDetails.gender}, {eachUserDetails.age}
        </p>
        <div className="card-actions justify-end">
          <button
            className="btn btn-primary"
            onClick={() =>
              handleActionsOnUserCards("ignored", eachUserDetails._id)
            }
          >
            Ignore
          </button>
          <button
            className="btn btn-primary"
            onClick={() =>
              handleActionsOnUserCards("interested",eachUserDetails._id)
            }
          >
            Interested
          </button>
        </div>
      </div>
    </div>
  );
};
