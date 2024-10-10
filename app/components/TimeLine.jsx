import React from "react";
import iconos from "@/app/utils/iconos";
import Image from "next/image";

function TimeLine({ cumpleañeros, mesActual }) {
  console.log(cumpleañeros);
  return (
    <div className="w-full card shadow-md bg-base-100 items-center  ">
      <div className="w-full sticky top-0 flex justify-center">
        <h1 className="font-bold">Cumpleañeros del mes de {mesActual}</h1>
      </div>
      <div className="overflow-ellipsis overflow-x-scroll p-5">
        <ul className="timeline md:timeline-horizontal">
          {cumpleañeros.map((alumno, idx) => (
            <li key={idx}>
              {idx > 0 ? <hr /> : <></>}
              <div className="timeline-start">{alumno.fecha_nac}</div>
              <div className="timeline-middle">
                <Image src={iconos.calendario} alt="Editar" width={22} />
              </div>
              <div className="timeline-end timeline-box">{alumno.nombre}</div>
              <hr />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TimeLine;
