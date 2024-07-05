import React from "react";
function TablaFormaPago({ formaPagosFiltrados, isLoading }) {
  console.log("filtrados", formaPagosFiltrados);
  return !isLoading ? (
    <div className="overflow-x-auto mt-3  h-7/8 text-black">
      <table className="table table-xs table-pin-rows table-pin-cols">
        <thead>
          <tr>
            <th className="w-[calc(10%)]">Acciones</th>
            <td>id</td>
            <td>Descripcion</td>
            <td>Comision</td>
            <td>Aplicacion</td>
            <td>Cuenta Banco</td>
            <th>id</th>
          </tr>
        </thead>
        <tbody>
          {formaPagosFiltrados.map((item) => (
            <tr key={item.id}>
              <th>
                <div className="flex flex-row space-x-3">
                  <kbd className="kbd dark:text-white">
                    <i className="fa-solid fa-eye"></i>
                  </kbd>
                  <kbd className="kbd dark:text-white">
                    <i className="fa-solid fa-file"></i>
                  </kbd>
                  <kbd className="kbd dark:text-white">
                    <i className="fa-solid fa-trash"></i>
                  </kbd>
                </div>
              </th>
              <td>{item.id}</td>
              <td>{item.descripcion}</td>
              <td>{item.comision}</td>
              <td>{item.aplicacion}</td>
              <td>{item.cue_banco}</td>
              <th>{item.id}</th>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th>Acciones</th>
            <td>id</td>
            <td>Descripcion</td>
            <td>Comision</td>
            <td>Aplicacion</td>
            <td>Cuenta Banco</td>
            <th>id</th>
          </tr>
        </tfoot>
      </table>
    </div>
  ) : (
    <div>cargando </div>
  );
}

export default TablaFormaPago;
