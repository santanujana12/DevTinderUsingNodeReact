import React from "react";
import { Link } from "react-router-dom";

export const SideNavPanel = () => {
  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-gray-800 text-white z-40">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-200">Side Nav Panel</h1>
      </div>
      <div>
        <ul className="p-4">
          <li className="py-2 hover:bg-gray-700 cursor-pointer">
            <Link
              to="/dashboard/feed"
              className="w-full text-left flex items-center pl-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-1a1 1 0 00-1 1v2a1 1 0 001 1h1a1 1 0 001-1V9a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1h-2a1 1 0 001-1V7a1 1 0 001 1h1a1 1 0 001-1V3a1 1 0 00-1-1h-1a1 1 0 00-1 1v2a1 1 0 001 1h1a1 1 0 001-1V0" />
              </svg>
              Feed
            </Link>
          </li>
          <li className="py-2 hover:bg-gray-700 cursor-pointer">
            <Link
              to="/dashboard/requests"
              className="w-full text-left flex items-center pl-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 8v-2a1 1 0 00.293.707z" />
                <path d="M6 8a2 2 0 012-2v2a2 2 0 100 4v2a2 2 0 100 4v-2a2 2 0 00-2-2V8m0-1a1 1 0 00-1 1v2a1 1 0 100 2V8a1 1 0 00-1-1z" />
              </svg>
              Manage Requests
            </Link>
          </li>
          <li className="py-2 hover:bg-gray-700 cursor-pointer">
            <Link
              to="/dashboard/connections"
              className="w-full text-left flex items-center pl-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 0 6 6 0 00-6 0z" />
              </svg>
              My Connections
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};