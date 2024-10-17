import React from "react";
import iconos from "@/app/utils/iconos";
import Image from "next/image";
import { useState } from "react";
import CardsView from "./CardsView";
import ListView from "./ListView";
function Cumpleañeros({ cumpleañeros, mesActual }) {
 

  const [cumpleView, setCumpleView] = useState(false);

 
  return (
    <div className="w-full card shadow-lg bg-base-100  items-center p-5 mb-4">
      <div className="w-full sticky top-0 flex justify-center my-4">
        <div className="grid grid-flow-row">
          <h1 className="font-bold">Cumpleañeros del mes de {mesActual}</h1>
          <label className="swap swap-rotate">
            <input
              type="checkbox"
              onChange={() => setCumpleView(!cumpleView)}
            />
            <div className="swap-off h-5 w-5 fill-current">
              <Image src={iconos.tarjetas}></Image>
            </div>
            <div className="swap-on h-5 w-5 fill-current">
              <Image src={iconos.lista}></Image>
            </div>
          </label>
        </div>
      </div>
      {cumpleView ? (
        <CardsView
          cumpleañeros={cumpleañeros}
        ></CardsView>
      ) : (
        <ListView
          cumpleañeros={cumpleañeros}
        ></ListView>
      )}
    </div>
  );
}

export default Cumpleañeros;
