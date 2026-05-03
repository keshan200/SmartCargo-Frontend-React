import { useNavigate } from "react-router-dom";

export default function AccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center px-4 font-['Poppins',sans-serif]">
      <div className="w-full text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#dc2626"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>

        {/* Message */}
        <p className="text-gray-600 mb-8">
          You need to be logged in to access this page. Please log in to your account to continue.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/login")}
            className="w-full px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5 shadow-md hover:shadow-lg"
          >
            Go to Login
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full px-6 py-3 border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold rounded-xl transition-all duration-200 bg-white hover:bg-gray-50"
          >
            Go to Home
          </button>
        </div>

        {/* Footer message */}
        <div className="mt-8 p-4 bg-orange-50 border border-orange-100 rounded-lg">
          <p className="text-sm text-gray-600">
            If you believe this is an error, please contact the system administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
