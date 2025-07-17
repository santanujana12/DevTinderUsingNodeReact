import { use, useState } from "react";

export const UserConnectionCards = ({
  eachConnection,
  isActive,
  setActiveUserCard,
}) => {
  const [triggerToolTip, setTriggerToolTip] = useState(false);
  return (
    <div
      className={`${
        isActive
          ? "card bg-gray-600 shadow-md flex flex-row border-b-2 m-2 hover:bg-gray-600 cursor-pointer"
          : "card bg-base-300 shadow-md flex flex-row border-b-2 m-2 hover:bg-gray-600 cursor-pointer"
      }`}
      onClick={() => setActiveUserCard(eachConnection.id)}
    >
      <figure className="w-1/4 object-contain">
        <img
          src={eachConnection.photoUrl}
          alt={eachConnection.firstName + " " + eachConnection.lastName}
          className="object-cover"
        />
      </figure>
      <div className="card-body flex flex-col justify-center p-4 w-full">
        <h2 className="card-title text-lg font-bold">
          {eachConnection.firstName +
            " " +
            eachConnection.lastName +
            ", " +
            eachConnection.age}
        </h2>
        <p className="text-md">{eachConnection.bio}</p>
      </div>
      <div>
        <button className="btn">:</button>
        {triggerToolTip && (
          <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
            <li>Remove Connection</li>
            <li>View Profile</li>
          </ul>
        )}
      </div>
    </div>
  );
};
