import React from "react";
import { useState } from "react";
import { useEffect } from "react";

function Sheet({
  labels,
  setLabels,
  selectedIndex,
  setSelectedIndex,
  changeSelectedLabel,
  setTextoAnterior,
  currentID,
}) {
  const handleDoubleClick = (event) => {
    event.preventDefault();
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const maxNumeroDato = Math.max(...labels.map((lbl) => lbl.numero_dato)) + 1;
    setLabels([
      ...labels,
      {
        columna_impresion: x,
        renglon_impresion: y,
        descripcion_campo: "Texto",

        cuenta: 0,
        font_bold: "N",
        font_italic: "N",
        font_nombre: "Arial",
        font_rallado: "N",
        font_subrallado: "N",
        font_tamaño: 9,
        forma_columna: 9030,
        forma_columna_dos: 0,
        forma_renglon: 3120,
        forma_renglon_dos: 0,
        formato: 2,
        funcion: 0,
        importe_transaccion: 0,
        longitud: 10,
        naturaleza: 0,
        nombre_campo: "",
        numero_archivo: 12,
        numero_dato: maxNumeroDato,
        numero_forma: currentID,
        tiempo_operacion: 0,
        tipo_campo: 2,
        visible: "S",
      },
    ]);
  };

  const handleClick = (evt, index) => {
    evt.preventDefault();
    setSelectedIndex(index);
    const selectedlabel = document.getElementById(
      evt.target.attributes["name"].value
    );
    changeSelectedLabel(evt.target.attributes["name"].value);
    setTextoAnterior(evt.target.attributes["name"].value);
    selectedlabel.classList.add(
      "border-2",
      "border-blue-500",
      "border-dashed",
      "rounded-lg"
    );
  };

  const handleDragStart = (event, index) => {
    event.dataTransfer.setData("index", index);
  };
  const roundToNearest = (value, threshold) => {
    const roundedValue = Math.round(value / threshold) * threshold;
    return roundedValue;
  };
  const handleDragOver = (evt) => {
    evt.preventDefault();
  };
  const handleDrop = (evt) => {
    const index = evt.dataTransfer.getData("index");
    const rect = evt.currentTarget.getBoundingClientRect();
    let x = evt.clientX - rect.left - 15;
    let y = evt.clientY - rect.top - 15;
    const redondea = 10;
    x = roundToNearest(x, redondea);
    y = roundToNearest(y, redondea);
    x = Math.max(x, 0);
    y = Math.max(y, 0);
    const resultado = labels.map((lbl, idx) => {
      return idx === parseInt(index)
        ? { ...lbl, columna_impresion: x, renglon_impresion: y }
        : lbl;
    });

    setLabels(resultado);
    setSelectedIndex(index);
  };


  const originalWidth = 210; // Ancho original en mm
  const currentWidth = selectedIndex ? 170 : 210; // Ancho actual en mm
  const scale = currentWidth / originalWidth;
  return (
    <div
      className={`${selectedIndex ? 'h-[calc(197mm)]' : 'h-[calc(297mm)]'} m-1 border-solid border bg-white shadow-xl flex flex-col relative`}
      style={{
        width: `${currentWidth}mm`,
      }}
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
          className="hover:cursor-move text-black dark:text-black"
          onClick={(evt) => handleClick(evt, index)}
          style={{
            position: "absolute",
            left: `${label.columna_impresion * scale}px`,
            top: `${label.renglon_impresion * scale}px`,
            padding: "2px 2px",
            fontFamily: `${label.font_nombre}`,
            fontWeight: label.font_bold === "S" ? "bold" : "normal",
            fontSize: `${label.font_tamaño * scale * 1.3333}px`,
            fontStyle: label.font_italic === "S" ? "italic" : "normal",
            textDecoration: `${label.font_subrallado === "S" ? "underline" : ""} ${label.font_rallado === "S" ? "line-through" : ""}`,
          }}
        >
          {label.descripcion_campo}
        </label>
      ))}
    </div>
  );
}

export default Sheet;
