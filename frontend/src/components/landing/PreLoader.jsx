import React from "react";

const PreLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-white to-blue-500">
      <h1 className="text-8xl font-bold text-white animate-pulse">Athena AI</h1>
    </div>
  );
};

export default PreLoader;
