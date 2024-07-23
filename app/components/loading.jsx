import React from "react";

function Loading() {
  return (
    <div className="flex items-center md:-mt-10 mt-10 rounded-3xl">
      <div className="bg-salte-100 rounded-3xl">
        <div className=" md:p-52 p-10 flex flex-col rounded-3xl h-5/6">
          <div className="flex items-center justify-center">
            <span className="loading loading-ring h-52 w-52 text-black dark:text-white"></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loading;
