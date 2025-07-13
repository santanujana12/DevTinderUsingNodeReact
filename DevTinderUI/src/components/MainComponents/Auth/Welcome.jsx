import { Link } from "react-router-dom";

export const Welcome = () => {
  return (
    <div className="flex justify-center items-center min-h-screen py-20">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-4 text-primary">Welcome to</h1>
          <h2 className="text-4xl font-bold mb-6 text-secondary">Tinder 💘 Clone</h2>
          <p className="text-lg mb-8 text-base-content/70">
            Find your perfect match and connect with people around you!
          </p>
        </div>
        
        <div className="card bg-base-200 shadow-xl p-6">
          <p className="text-lg mb-6 font-medium">
            Ready to start your journey?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="btn btn-primary btn-lg flex-1">
              Login
            </Link>
            <Link to="/sign-up" className="btn btn-secondary btn-lg flex-1">
              Sign Up
            </Link>
          </div>
        </div>
        
        <div className="mt-8 text-sm text-base-content/60">
          <p>Join thousands of users finding meaningful connections</p>
        </div>
      </div>
    </div>
  );
};
