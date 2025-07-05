export const SuggestiveUserCards = ({ eachUserDetails }) => {
  return (
    <div className="card bg-base-100 w-96 shadow-sm">
      <figure>
        <img
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
          <button className="btn btn-primary">Not Interested</button>
          <button className="btn btn-primary">Interested</button>
        </div>
      </div>
    </div>
  );
};
