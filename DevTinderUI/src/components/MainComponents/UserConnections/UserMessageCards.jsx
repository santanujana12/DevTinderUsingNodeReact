export const UserMessageCard = ({eachConnection,setActiveUserCard}) => {
  return (
    <div className="h-[calc(100vh-16rem)] w-2/3 bg-gray-900 rounded-md overflow-y-scroll relative">
      <div className="card-body flex flex-row justify-between border-b-2">
        <h2 className="card-title justify-center">Messages, {eachConnection.firstName} </h2>
        <button className="btn" onClick={() => setActiveUserCard(null)}>X</button>
      </div>
      <div className="w-full absolute bottom-0 mb-4 p-4">
        <footer>
            <span>

            </span>
            <input className="w-full border-2 rounded-lg h-10 p-2" type="text" placeholder="Enter your message" />
        </footer>
      </div>
    </div>
  );
};
