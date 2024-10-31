import React from "react";
import { useErrorModel } from "../../contexts/ErrorModelProvider"; 

const ErrorModel = () => {
  const {  error, refetchData } = useErrorModel();


  if (error) return (
    <div className="flex flex-col items-center justify-center w-full h-full text-center bg-red-50 p-4 rounded-md">
      <h2 className="text-2xl font-semibold text-red-600 mb-4">Oops! Something went wrong</h2>
      <p className="text-gray-700 mb-6">{"We encountered an unexpected error. Please try again."}</p>
      <button 
        onClick={refetchData} 
        className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
      >
        Retry
      </button>
    </div>
  );

  return null;
};

export default ErrorModel;
