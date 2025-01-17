import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { getCicloEscolar } from '../utils/api/cambio_ciclo_escolar/cambio_ciclo_escolar';
import { getPropietario } from '../utils/api/propietario/propietario';
import { formatDate } from '../utils/globalfn';

function SistemaInfo() {
  const { data: session, status } = useSession();
  const [fechaHoy, setFechaHoy] = useState("");
  const [cicloEscolar, setCicloEscolar] = useState("");
  const [usuario, setUsuario] = useState("");
  const [propietario, setPropietario] = useState("");

  useEffect(() => {
    if (status === "loading" || !session) return; // Si está cargando o no hay sesión, no hacer nada

    const fetchDatos = async () => {
      const { token } = session.user;
      const [dataCicloEscolar, dataPropietario] = await Promise.all([
        getCicloEscolar(token),
        getPropietario(token)
      ]);
      const fecha = new Date();
      setFechaHoy(formatDate(fecha));
      setCicloEscolar(dataCicloEscolar);
      setUsuario(session.user.nombre);
      setPropietario(dataPropietario[0]);
    };

    fetchDatos();
  }, [session, status]);

  // Si no hay sesión, no mostrar información
  if (!session) {
    return <div className="text-center">No hay sesión activa.</div>;
  }

  return (
    <div className="sticky top-16 h-full lg:max-h-10 md:max-h-20 max-h-24 bg-base-100 dark:bg-slate-600 p-2 z-[1]">
      <div className="flex flex-wrap lg:flex-nowrap justify-center text-center gap-2">
        <div className="text-center gap-2 sm:flex text-black dark:text-white">
          <h1><span className="font-bold">Propietario:</span> {propietario.nombre} </h1>
          <h1><span className="font-bold">Usuario:</span> {usuario}</h1>
        </div>
        <div className="text-center gap-2 flex text-black dark:text-white">
          <h1><span className="font-bold">Ciclo Escolar:</span> {cicloEscolar.ciclo_escolar}</h1>
          <h1><span className="font-bold">Fecha:</span> {fechaHoy}</h1>
        </div>
      </div>
    </div>
  );
}

export default SistemaInfo;
