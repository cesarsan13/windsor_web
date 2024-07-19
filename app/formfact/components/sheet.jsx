import React from "react";
import { useState } from "react";
import { useEffect } from "react";

function Sheet({ labels, setLabels }) {
  const handleDoubleClick = (event) => {
    event.preventDefault();
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setLabels([...labels, { x, y, text: "Texto" }]);
  };
  return (
    <div
      className="w-[calc(8.5in)] h-[calc(11in)] m-5 p-(1in) border-solid border bg-white  shadow-xl flex flex-col relative"
      onDoubleClick={(evt) => handleDoubleClick(evt)}
    >
      {labels.map((label, index) => (
        <label
          key={index}
          name={`texto_`}
          style={{
            position: "absolute",
            left: `${label.x}px`,
            top: `${label.y}px`,
            backgroundColor: "rgba(255, 255, 255, 0.8)",

            padding: "2px 5px",
            fontSize: "14px",
          }}
        >
          {label.text}
        </label>
      ))}
    </div>
  );
}

export default Sheet;
