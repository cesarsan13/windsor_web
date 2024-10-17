import React from "react";
import Image from "next/image";
const pastel = require("@/public/pastel.png");
import { useRef, useEffect } from "react";

function CardsView({ cumpleañeros }) {
  const cumpleañeroRef = useRef(null);
  const primerCumpleañero = useRef(null);
  useEffect(() => {
    if (cumpleañeroRef.current) {
      cumpleañeroRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center", // Centra el elemento horizontalmente
        block: "nearest",
      });
    }
  }, []);
  return (
    <div className="carousel carousel-vertical carousel-center rounded-box h-96">
      {cumpleañeros.map((alumno, idx) => {
        let nueva_fecha = new Date(alumno.fecha_nac);
        let fecha_hoy = new Date();
        const opciones = { day: "numeric", month: "long" };
        const fechaFormateada = nueva_fecha.toLocaleDateString(
          "es-ES",
          opciones
        );
        let numero_em_curso = nueva_fecha.getDate();
        let numero_fecha_hoy = fecha_hoy.getDate();
        let es_cumpleañero = numero_em_curso === numero_fecha_hoy;

        return (
          <div
            className="flex carousel-item bg-neutral-200 h-3/4 w-60 p-2 m-2 rounded-xl"
            key={idx}
            ref={
              es_cumpleañero
                ? (element) => {
                    if (!primerCumpleañero.current) {
                      cumpleañeroRef.current = element;
                      primerCumpleañero.current = true;
                    }
                  }
                : null
            }
          >
            <div className="h-full w-full flex flex-col justify-center items-center ">
              <div className="grid grid-flow-row place-items-center gap-2 pb-4">
                <h1 className="font-bold text-2xl font-mono">
                  {es_cumpleañero ? `¡Feliz Cumpleaños!` : fechaFormateada}
                </h1>
                {es_cumpleañero && (
                  <div className="glass rounded-lg mask mask-squircle py-2">
                    <Image
                      className=""
                      src={pastel}
                      width={150}
                      alt={`cump ${idx}`}
                    ></Image>
                  </div>
                )}
                <p className="Cumpleañeros-box text-xs text-center ">
                  {alumno.nombre}
                </p>
                {es_cumpleañero && (
                  <p className="font-bold text-md ">{fechaFormateada}</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CardsView;
