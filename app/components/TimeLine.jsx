import React from "react";
import iconos from "@/app/utils/iconos";
import Image from "next/image";
import { useRef, useEffect } from "react";

function TimeLine({ cumpleañeros, mesActual }) {
  const cumpleañeroRef = useRef(null);

  useEffect(() => {
    if (cumpleañeroRef.current) {
      cumpleañeroRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, []);
  return (
    <div className="w-full card shadow-md bg-base-100 items-center  ">
      <div className="w-full sticky top-0 flex justify-center">
        <h1 className="font-bold">Cumpleañeros del mes de {mesActual}</h1>
      </div>
      <div className="overflow-ellipsis overflow-x-scroll p-5">
        <ul className="timeline md:timeline-horizontal">
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
            let es_cumpleañero =
              numero_em_curso === numero_fecha_hoy ? true : false;
            return (
              <li
                key={idx}
                ref={
                  es_cumpleañero && !cumpleañeroRef.current
                    ? cumpleañeroRef
                    : null
                }
              >
                {idx > 0 ? <hr /> : <></>}
                <div
                  className={`timeline-start  ${
                    es_cumpleañero
                      ? "font-bold  shadow-sm   border-none rounded-lg bg-transparent "
                      : "font-thin "
                  }`}
                >
                  {fechaFormateada}
                </div>
                <div className="timeline-middle">
                  <Image src={iconos.calendario} alt="Editar" width={22} />
                </div>
                <div
                  className={`timeline-end timeline-box ${
                    es_cumpleañero
                      ? "font-bold border-green-500 bg-green-300  shadow-lg shadow-black"
                      : "font-thin"
                  }`}
                >
                  {alumno.nombre}
                </div>
                <hr />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default TimeLine;
