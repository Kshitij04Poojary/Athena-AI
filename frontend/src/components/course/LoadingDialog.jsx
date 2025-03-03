import React from "react";
import { Loader2 } from "lucide-react";

const LoadingDialog = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-8 rounded-lg flex flex-col items-center gap-4">
        <h2 className="text-lg font-semibold">Hold on, your course will be generated soon!!!!</h2>
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    </div>
  );
};

export default LoadingDialog;
