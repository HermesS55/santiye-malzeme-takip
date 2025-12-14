import React from "react";

function Yukleniyor() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200 transition-colors duration-500">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 dark:border-blue-400 mb-4"></div>
      <p className="text-lg font-medium">Yükleniyor, lütfen bekleyin...</p>
    </div>
  );
}

export default Yukleniyor;
