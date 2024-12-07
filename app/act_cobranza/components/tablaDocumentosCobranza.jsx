import Loading from "@/app/components/loading";
import NoData from "@/app/components/NoData";
import { showSwal } from "@/app/utils/alerts";
import { getProductos } from "@/app/utils/api/productos/productos";
import { formatNumber } from "@/app/utils/globalfn";
import iconos from "@/app/utils/iconos";
import Image from "next/image";
import React from "react";

function TablaDocumentosCobranza({
  session,
  documentos,
  isLoading,
  showModal,
  setDocumento,
  setAccion,
  setCurrentId,
  productos
}) {
  const tableAction = (evt, documento, accion) => {
    const producto = productos.find(producto => producto.numero === documento.producto)
    if (producto) {
      showSwal("INFO", "No puedes acceder al registro porque el producto está dado de baja.", 'info')
      return
    }
    setDocumento(documento);
    setAccion(accion);
    setCurrentId(documento.numero_doc);
    showModal(true);
  };
  return !isLoading ? (
    <div className="overflow-y-auto mt-3 h-[calc(55vh)] md:h-[calc(35vh)] text-black bg-white dark:bg-[#1d232a] dark:text-white  w-full lg:w-full">
      {documentos.length > 0 ? (
        <table className="table table-xs table-zebra w-full">
          <thead className="sticky top-0 bg-white dark:bg-[#1d232a] z-[2]">
            <tr>
              <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Ver</th>
              <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Editar</th>
              <th className="w-[5%] pt-[.10rem] pb-[.10rem]">Eliminar</th>
              <td className="sm:w-[5%] pt-[.5rem] pb-[.5rem]">Producto</td>
              <td className="w-[60%] pt-[.10rem] pb-[.10rem]">Descripción</td>
              <td className="w-[10%] pt-[.10rem] pb-[.10rem]">Documento</td>
              <td className="w-[60%] pt-[.10rem] pb-[.10rem]">Fecha</td>
              <td className="w-[40%] pt-[.10rem] pb-[.10rem]">Importe</td>
              <td className="w-[40%] pt-[.10rem] pb-[.10rem]">Desc</td>
              <td className="w-[40%] pt-[.10rem] pb-[.10rem]">F. Pago</td>
              <td className="w-[40%] pt-[.10rem] pb-[.10rem]">Imp. Pago</td>
            </tr>
          </thead>
          <tbody>
            {documentos.map((item) => (
              <tr key={item.numero} className="hover:cursor-pointer">
                <th className="w-[5%] pt-[.10rem] pb-[.10rem]">
                  <div
                    data-tip={`Ver`}
                    onClick={(evt) => tableAction(evt, item, `Ver`)}
                    className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white w-5 h-5 md:w-[1.80rem] md:h-[1.80rem] content-center"
                  >
                    <Image src={iconos.ver} alt="Editar" />
                  </div>
                </th>
                <th className="w-[5%] pt-[.10rem] pb-[.10rem]">
                  <div
                    className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white w-5 h-5 md:w-[1.80rem] md:h-[1.80rem] content-center"
                    data-tip={`Editar`}
                    onClick={(evt) => tableAction(evt, item, `Editar`)}
                  >
                    <Image src={iconos.editar} alt="Editar" />
                  </div>
                </th>
                <th className="w-[5%] pt-[.10rem] pb-[.10rem]">
                  <div
                    className="kbd pt-1 tooltip tooltip-left hover:cursor-pointer bg-transparent hover:bg-transparent text-black border-none shadow-none dark:text-white w-5 h-5 md:w-[1.80rem] md:h-[1.80rem] content-center"
                    data-tip={`Eliminar`}
                    onClick={(evt) => tableAction(evt, item, "Eliminar")}
                  >
                    <Image src={iconos.eliminar} alt="Eliminar" />
                  </div>
                </th>
                <th
                  className={
                    typeof item.producto === "number"
                      ? "text-left"
                      : "text-right"
                  }
                >
                  {item.producto}
                </th>
                <td>{item.descripcion}</td>
                <td>{item.numero_doc}</td>
                <td>{item.fecha}</td>
                <td className="text-right">{formatNumber(item.importe, 2)}</td>
                <td className="text-right">{formatNumber(item.descuento, 2)}</td>
                <td>{item.fecha_cobro}</td>
                <td className="text-right">{formatNumber(item.importe_pago, 2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <NoData />
      )}
    </div>
  ) : (
    <Loading />
  );
}

export default TablaDocumentosCobranza;
