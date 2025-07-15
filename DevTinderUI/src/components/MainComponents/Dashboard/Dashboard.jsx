import { Outlet } from "react-router-dom";

export const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-500">
      {/* Main content area - adjust margin based on sidebar state */}
      <div className="ml-64 pt-16 min-h-screen">
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
