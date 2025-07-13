import { Outlet } from "react-router-dom";

export const Dashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Dashboard can have its own sidebar or additional navigation if needed */}
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
};
