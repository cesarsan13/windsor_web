import React from "react";
function TablaFormaPago({ formaPagosFiltrados, isLoading }) {
  console.log("filtrados", formaPagosFiltrados);
  return !isLoading ? (
    <div className="overflow-x-auto mt-3  h-7/8 text-black bg-white">
      <table className="table table-xs table-zebra table-pin-rows table-pin-cols">
        <thead>
          <tr>
            <th></th>
            <td>Descripcion</td>
            <td>Comision</td>
            <td>Aplicacion</td>
            <td>Cuenta Banco</td>
            <th className="w-[calc(10%)]">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {formaPagosFiltrados.map((item) => (
            <tr key={item.id}>
              <th>{item.id}</th>
              <td>{item.descripcion}</td>
              <td>{item.comision}</td>
              <td>{item.aplicacion}</td>
              <td>{item.cue_banco}</td>
              <th>
                <div className="flex flex-row space-x-3">
                  {/* <kbd className="kbd dark:text-white">
                    <i className="fa-solid fa-eye"></i>
                  </kbd> */}
                  <div
                    className="tooltip tooltip-left hover:cursor-pointer"
                    data-tip="Editar"
                  >
                    <kbd className="kbd dark:text-white">
                      <i className="fa-solid fa-file"></i>
                    </kbd>
                  </div>
                  <div
                    className="tooltip tooltip-left hover:cursor-pointer"
                    data-tip="Eliminar"
                  >
                    <kbd className="kbd dark:text-white">
                      <i className="fa-solid fa-trash"></i>
                    </kbd>
                  </div>
                </div>
              </th>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th></th>
            <td>Descripcion</td>
            <td>Comision</td>
            <td>Aplicacion</td>
            <td>Cuenta Banco</td>
            <th>Acciones</th>
          </tr>
        </tfoot>
      </table>
    </div>
  ) : (
    <div>cargando </div>
  );
}

export default TablaFormaPago;
