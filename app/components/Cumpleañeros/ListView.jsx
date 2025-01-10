import React from "react";
import Image from "next/image";
import iconos from "@/app/utils/iconos";
import { useRef, useEffect } from "react";
const pastel = require("@/public/pastel.png");
import { FaXmark } from "react-icons/fa6";

function ListView({ cumpleañeros }) {
  const cumpleañeroRefl = useRef(null);
  const primerCumpleañerol = useRef(null);
  useEffect(() => {
    if (cumpleañeroRefl.current) {
      cumpleañeroRefl.current.scrollIntoView({
        behavior: "smooth",
        inline: "center", // Centra el elemento horizontalmente
        block: "nearest",
      });
    }
  }, []);
  return (
    <div className="carousel carousel-vertical carousel-center rounded-box  h-96 w-64 grid grid-flow-row  gap-1">
      {cumpleañeros && cumpleañeros.length > 0 ? (
      cumpleañeros.map((alumno, idx) => {
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
            className={`flex carousel-item ${es_cumpleañero ? "bg-base-200 dark:bg-[#1d232a] shadow-lg" : "bg-base-200 dark:bg-[#1d232a]"
              }   rounded-box p-2 m-2 grid grid-rows-2 grid-cols-4 grid-flow-col `}
            key={idx}
            ref={
              es_cumpleañero
                ? (element) => {
                  if (!primerCumpleañerol.current) {
                    cumpleañeroRefl.current = element;
                    primerCumpleañerol.current = true;
                  }
                }
                : null
            }
          >
            <div className="bg-base-200 dark:bg-[#1d232a] row-span-2 col-span-1 grid content-center justify-items-center w-16 ">
              {
                <>
                  <Image
                    width={es_cumpleañero ? 50 : 26}
                    alt={alumno.nombre}
                    src={es_cumpleañero ? pastel : iconos.calendario}
                    className="block dark:hidden "
                  ></Image>
                  <Image
                    width={es_cumpleañero ? 50 : 26}
                    alt={alumno.nombre}
                    src={es_cumpleañero ? pastel : iconos.calendario_w}
                    className="hidden dark:block"
                  ></Image>
                </>
              }
            </div>
            <div
              className={`col-span-3 text-xs text-black dark:text-white content-center ${es_cumpleañero ? "font-bold" : "font-thin"
                }`}
            >
              <p className="truncate">{alumno.nombre}</p>
            </div>
            <div
              className={`col-span-3 text-xs text-black dark:text-white content-center ${es_cumpleañero ? "font-bold" : "font-thin"
                }`}
            >
              <p>{fechaFormateada}</p>
            </div>
          </div>
        );
      })
    ) : (
      <div className='carousel-item bg-base-200 dark:bg-[#1d232a] rounded-box p-2 m-2 w-4/5 h-10  grid-cols-4 '>
          <div className='bg-base-200 dark:bg-[#1d232a] row-span-2 col-span-1 grid content-center justify-items-center w-16 '>
              <FaXmark className='w-7 h-7 block dark:hidden text-black dark:text-white' />
              <FaXmark className='w-7 h-7 hidden dark:block text-black dark:text-white' />
          </div>
          <div className='col-span-3 text-xs text-black dark:text-white content-center font-thin'>
              <p className="truncate">No hay cumpleañeros.</p>
          </div>
      </div>
    )}
    </div>
    // </div>
  );
}

export default ListView;
