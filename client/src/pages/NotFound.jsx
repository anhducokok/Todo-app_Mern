import React from "react";
import NotFoundImage from "@/assets/404_NotFound.png";
const NotFound = () => {
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-slate-50">
      <img
        src={NotFoundImage}
        alt="Not Found"
        className="w-1/2 max-w-sm mb-8"
      />
      <h1 className="text-4xl font-bold mb-4 text-gray-800">
        404 - Page Not Found
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Sorry, the page you are looking for does not exist.
      </p>
      <a
        href="/"
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Go Back Home
      </a>
    </div>
  );
};

export default NotFound;
