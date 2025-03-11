import React, { useState, useRef, useEffect } from "react";
import Loading from "@/app/components/loading";
import NoData from "@/app/components/NoData";
import Image from "next/image";
import iconos from "@/app/utils/iconos";
import { formatNumber } from "@/app/utils/globalfn";
import { showSwalAndWait } from "@/app/utils/alerts";

function TablaC_Otras({
  session,
  c_OtrasFiltrados,
  isLoading,
  setC_Otra,
  setAccion,
  setCurrentId,
  c_Otras,
  setC_Otras,
  setC_OtrasFiltrados,
  aignatura_nombre,
  permiso_cambio,
}) {
  const [editMode, setEditMode] = useState(null);
  const [editedCalificaciones, setEditedCalificaciones] = useState({});
  const inputRefs = useRef({});

  const tableAction = (evt, calificacion, accion) => {
    setC_Otra(calificacion);
    setAccion(accion);
    setCurrentId(calificacion.numero);
    if (accion === "Editar") {
      setEditMode(calificacion.numero);
      setEditedCalificaciones((prev) => ({
        ...prev,
        [calificacion.numero]: calificacion.calificacion,
      }));
    } else {
      setEditMode(null);
    }
  };

  useEffect(() => {
    if (editMode !== null && inputRefs.current[editMode]) {
      inputRefs.current[editMode].focus();
    }
  }, [editMode]);

  const saveCalificacion = async (numero) => {
    let newValue = parseFloat(editedCalificaciones[numero]);
    if (newValue > 10) {
      await showSwalAndWait("WARNING!", "El máximo valor permitido es 10", "info");
      newValue = 0;
      setEditedCalificaciones((prev) => ({
        ...prev,
        [numero]: newValue,
      }));
      return;
    } else if (newValue < 0) {
      await showSwalAndWait("WARNING!", "El valor debe ser mayor o igual a 0", "info");
      newValue = 0;
      setEditedCalificaciones((prev) => ({
        ...prev,
        [numero]: newValue,
      }));
      return;
    }
    const index = c_Otras.findIndex((fp) => fp.numero === numero);
    if (index !== -1) {
      const fpFiltrados = c_Otras.map((fp) =>
        fp.numero === numero ? { ...fp, calificacion: formatNumber(newValue) } : fp
      );
      setC_Otras(fpFiltrados);
      setC_OtrasFiltrados(fpFiltrados);
    }
    setEditMode(null);
  };

  const ActionButton = ({ tooltip, iconDark, iconLight, onClick, permission }) => {
    if (!permission) return null;
    return (
      <th>
        <div
          className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white w-5 h-5 md:w-[1.80rem] md:h-[1.80rem] content-center"
          data-tip={tooltip}
          onClick={onClick}
        >
          <Image src={iconDark} alt={tooltip} className="block dark:hidden" />
          <Image src={iconLight} alt={tooltip} className="hidden dark:block" />
        </div>
      </th>
    );
  };

  const ActionColumn = ({ description, permission }) => {
    if (!permission) return null;
    return (
      <>
        <th className="w-[5%] pt-[.10rem] pb-[.10rem]">{description}</th>
      </>
    )
  }

  return !isLoading ? (
    <div className="overflow-y-auto mt-3 h-[calc(55vh)] md:h-[calc(65vh)] text-black bg-white dark:bg-[#1d232a] dark:text-white w-full lg:w-full">
      {c_OtrasFiltrados && c_OtrasFiltrados.length > 0 ? (
        <table className="table table-xs table-zebra w-full">
          <thead className="sticky top-0 bg-white dark:bg-[#1d232a] z-[2]">
            <tr>
              <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Núm.</td>
              <td className="w-[40%]">Alumno</td>
              <td className="w-[10%] text-right hidden sm:table-cell">{aignatura_nombre}</td>
              < ActionColumn
                description={"Editar"}
                permission={permiso_cambio}
              />
            </tr>
          </thead>
          <tbody>
            {c_OtrasFiltrados.map((item, index) => (
              <tr key={`${item.numero}-${index}`} className="hover:cursor-pointer">
                <th className="w-[5%] text-right">{item.numero}</th>
                <td className="w-[40%]"> {item.nombre} </td>
                <td className="w-[40%] text-right">
                  {editMode === item.numero ? (
                    <input
                      ref={(el) => (inputRefs.current[item.numero] = el)}
                      type="text"
                      min="0"
                      maxLength={4}
                      value={editedCalificaciones[item.numero] || ""}
                      onFocus={(e) => e.target.select()}
                      onKeyDown={(e) => e.key === "Enter" && saveCalificacion(item.numero)}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || /^\d*\.?\d*$/.test(value)) {
                          setEditedCalificaciones((prev) => ({
                            ...prev,
                            [item.numero]: value,
                          }));
                        }
                      }}
                      className="input input-bordered w-[6rem] text-right"
                    />
                  ) : (
                    <span>{item.calificacion || 0.00}</span>
                  )}
                </td>

                <th className="w-[5%] pt-[.10rem] pb-[.10rem]">
                  {editMode === item.numero ? (
                    <>
                      <button
                        className="btn btn-xs"
                        onClick={() => saveCalificacion(item.numero)}
                      >
                        Guardar
                      </button>
                      <button
                        className="btn btn-xs"
                        onClick={() => setEditMode(null)}
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <ActionButton
                      tooltip="Editar"
                      iconDark={iconos.editar}
                      iconLight={iconos.editar_w}
                      onClick={(evt) => tableAction(evt, item, "Editar")}
                      permission={permiso_cambio}
                    />
                  )}
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      ) : c_OtrasFiltrados != null &&
        session &&
        c_OtrasFiltrados.length === 0 ? (
        <NoData></NoData>
      ) : (
        <Loading></Loading>
      )}
    </div>
  ) : (
    <Loading />
  );
}

export default TablaC_Otras;
