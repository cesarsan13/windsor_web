import React from "react";
import { useState } from "react";
import { useEffect } from "react";

function Sheet({ labels, setLabels, selectedIndex, setSelectedIndex }) {
  const handleDoubleClick = (event) => {
    event.preventDefault();
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setLabels([
      ...labels,
      {
        columna_impresion: x,
        renglon_impresion: y,
        descripcion_campo: "Texto",
      },
    ]);
  };

  const handleClick = (evt, index) => {
    evt.preventDefault();
    setSelectedIndex(index);
    console.log(labels[selectedIndex]);
  };
  const handleDragStart = (event, index) => {
    event.dataTransfer.setData("index", index);
  };

  const handleDragOver = (evt) => {
    evt.preventDefault();
  };
  const handleDrop = (evt) => {
    const index = evt.dataTransfer.getData("index");
    const x = evt.clientX - evt.currentTarget.offsetLeft - 15;
    const y = evt.clientY - evt.currentTarget.offsetTop - 15;
    const resultado = labels.map((lbl, idx) => {
      return idx === parseInt(index)
        ? { ...lbl, columna_impresion: x, renglon_impresion: y }
        : lbl;
    });
    setLabels(resultado);
    setSelectedIndex(index);
  };

  return (
    <div
      className="w-[calc(8.5in)] h-[calc(11in)] m-5  border-solid border bg-white  shadow-xl flex flex-col relative"
      onDoubleClick={(evt) => handleDoubleClick(evt)}
      onDragOver={(evt) => handleDragOver(evt)}
      onDrop={(evt) => handleDrop(evt)}
    >
      {labels.map((label, index) => (
        <label
          draggable
          onDragStart={(evt) => handleDragStart(evt, index)}
          key={index}
          data-key={index}
          name={`texto_${label.numero_dato}`}
          id={`texto_${label.numero_dato}`}
          className="hover:cursor-move"
          onClick={(evt) => handleClick(evt, index)}
          style={{
            position: "absolute",
            left: `${label.columna_impresion}px`, //x
            top: `${label.renglon_impresion}px`, //y
            // backgroundColor: "rgba(255, 255, 255, 0.8)",
            alignContent: "center",
            padding: "2px 2px",
            fontFamily: `${label.font_nombre}`,
            fontWeight: label.font_bold === "S" ? `bold` : `normal`,
            fontSize: `${label.font_tamaño * 1.3333}px`,
            fontStyle: label.font_italic === "S" ? "italic" : "normal",
            textDecoration: `${
              label.font_subrallado === "S" ? "underline" : ""
            } ${label.font_rallado === "S" ? "line-through" : ""}`,
          }}
        >
          {label.descripcion_campo}
        </label>
      ))}
    </div>
  );
}

export default Sheet;
