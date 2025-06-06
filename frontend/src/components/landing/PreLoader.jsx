import React from "react";

const PreLoader = () => {
  return (
    <>
      <style>{`
        @keyframes progress {
          0% { left: -40%; }
          100% { left: 100%; }
        }
      `}</style>
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-white to-blue-100">
        <h1 className="text-4xl font-bold text-blue-700 mb-6">Athena AI</h1>
        <div className="relative w-48 h-2 bg-white rounded overflow-hidden">
          <div
            className="absolute top-0 left-0 h-2 w-2/5 bg-blue-700 rounded"
            style={{ animation: "progress 1.5s linear infinite" }}
          />
        </div>
      </div>
    </>
  );
};

export default PreLoader;
