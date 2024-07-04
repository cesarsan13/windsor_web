import React from "react";

function Loading() {
  return (
    <div className="flex justify-center items-center mt-2">
      <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-black"></div>
    </div>
  );
}

export default Loading;
