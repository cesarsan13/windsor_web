import React from "react";
import Link from "next/link";
function Menu({ vertical }) {
  return vertical ? (
    <ul
      tabIndex={0}
      className="menu menu-md dropdown-content bg-base-100 rounded-box  text-black dark:text-white mt-3 w-52 p-2 shadow z-50"
    >
      <li>
        <details>
          <summary>Archivos</summary>
          <ul>
            <li>
              <Link href="/alumnos">Alumnos</Link>
            </li>
            <li>
              <Link href="/productos">Productos</Link>
            </li>
            <li>
              <Link href="/comentarios">Comentarios</Link>
            </li>
            <li>
              <Link href="/cajeros">Cajeros</Link>
            </li>
            <li>
              <Link href="/horarios ">Horarios</Link>
            </li>
            <li>
              <Link href="/formapago">Forma de Pago</Link>
            </li>
            <li>
              <Link href="/formfact">Formato Variable</Link>
            </li>
            <li>
              {/* <Link href="" style={{ color: "red" }}>
                Etiquetas
              </Link> */}
            </li>
          </ul>
        </details>
      </li>
      {/* <li>
        <details>
          <summary>Pagos</summary>
          <ul>
            <li>
              <Link href="" style={{ color: "red" }}>
                Pagos
              </Link>
            </li>
          </ul>
        </details>
      </li> */}
      {/* <li>
        <details>
          <summary>Proceso</summary>
          <ul>
            <li>
              <Link href="" style={{ color: "red" }}>
                Adición de Productos a Cartera
              </Link>
            </li>
            <li>
              <Link href="" style={{ color: "red" }}>
                Emisión de Factura
              </Link>
            </li>
            <li>
              <Link href="" style={{ color: "red" }}>
                Factura Global
              </Link>
            </li>
            <li>
              <Link href="" style={{ color: "red" }}>
                Cancelación de Recibo
              </Link>
            </li>
            <li>
              <Link href="" style={{ color: "red" }}>
                Cancelación de Factura
              </Link>
            </li>
            <li>
              <Link href="" style={{ color: "red" }}>
                Actualiza Cobranza
              </Link>
            </li>
            <li>
              <Link href="" style={{ color: "red" }}>
                Cambio de Ciclo Escolar
              </Link>
            </li>
            <li>
              <Link href="" style={{ color: "red" }}>
                Cobranza Diaria
              </Link>
            </li>
            <li>
              <Link href="" style={{ color: "red" }}>
                Cambio Numero de Alumno
              </Link>
            </li>
          </ul>
        </details>
      </li> */}
      <li>
        <details>
          <summary>Reportes</summary>
          <ul>
            <li>
              <Link href="/rep_femac_6">Cobranza</Link>
            </li>
            <li>
              <Link href="/rep_femac_1">Relación General de Alumnos</Link>
            </li>
            <li>
              <Link href="/Rep_Femac_2">Lista de Alumnos por clase</Link>
            </li>
            <li>
              <Link href="/rep_femac_3">
                Lista de Alumnos por clase del mes
              </Link>
            </li>
            <li>
              <Link href="/rep_femac_13">
                Lista de alumnos por clase semanal{" "}
              </Link>
            </li>
            <li>
              {/* <Link href="" style={{ color: "red" }}>
                Credencial{" "}
              </Link> */}
            </li>
            <li>
              <Link href="/rep_femac_5">Altas y Bajas de Alumnos</Link>
            </li>
            <li>
              {/* <Link href="" style={{ color: "red" }}>
                Cartera{" "}
              </Link> */}
            </li>
            <li>
              <Link href="/rep_femac_8_anexo_1">Relacion de Recibos</Link>
            </li>
            <li>
              {/* <Link href="" style={{ color: "red" }}>
                Relacion de Facturas
              </Link> */}
            </li>
            <li>
              {/* <Link href="" style={{ color: "red" }}>
                Estado de cuenta
              </Link> */}
            </li>
            <li>
              {/* <Link href="" style={{ color: "red" }}>
                Reporte Cobranza por Alumno
              </Link> */}
            </li>
            <li>
              {/* <Link href="" style={{ color: "red" }}>
                Reporte Cobranza por Producto
              </Link> */}
            </li>
            <li>
              {/* <Link href="" style={{ color: "red" }}>
                Recibo de pagos
              </Link> */}
            </li>
            <li>
              {/* <Link href="" style={{ color: "red" }}>
                Reporte Flujo Efectivo
              </Link> */}
            </li>
            <li>
              {/* <Link href="" style={{ color: "red" }}>
                Alumnos con Beca
              </Link> */}
            </li>
            <li>
              {/* <Link href="" style={{ color: "red" }}>
                Alumnos Inscritos
              </Link> */}
            </li>
          </ul>
        </details>
      </li>
    </ul>
  ) : (
    <ul className="menu menu-horizontal px-1 z-[2] text-black dark:text-white">
      <li>
        <details>
          <summary>Archivos</summary>
          <ul className="p-5 mt-3 w-52 ">
            <li>
              <Link href="/alumnos">Alumnos</Link>
            </li>
            <li>
              <Link href="/productos">Productos</Link>
            </li>
            <li>
              <Link href="/comentarios">Comentarios</Link>
            </li>
            <li>
              <Link href="/cajeros">Cajeros</Link>
            </li>
            <li>
              <Link href="/horarios ">Horarios</Link>
            </li>
            <li>
              <Link href="/formapago">Forma de Pago</Link>
            </li>
            <li>
              <Link href="/formfact">Formato Variable</Link>
            </li>
            <li>
              {/* <Link href="" style={{ color: "red" }}>
                Etiquetas
              </Link> */}
            </li>
          </ul>
        </details>
      </li>

      <li>
        <details>
          <summary>Reportes</summary>
          <ul className="p-1 mt-3 w-60 ">
            <li>
              <Link href="/rep_femac_6">Cobranza</Link>
            </li>
            <li>
              <Link href="/rep_femac_1">Relación General de Alumnos</Link>
            </li>
            <li>
              <Link href="/Rep_Femac_2">Lista de Alumnos por clase</Link>
            </li>
            <li>
              <Link href="/rep_femac_3">
                Lista de Alumnos por clase del mes
              </Link>
            </li>
            <li>
              <Link href="/rep_femac_13">
                Lista de alumnos por clase semanal{" "}
              </Link>
            </li>
            <li>
              {/* <Link href="" style={{ color: "red" }}>
                Credencial{" "}
              </Link> */}
            </li>
            <li>
              <Link href="/rep_femac_5">Altas y Bajas de Alumnos</Link>
            </li>
            <li>
              {/* <Link href="" style={{ color: "red" }}>
                Cartera{" "}
              </Link> */}
            </li>
            <li>
              <Link href="/rep_femac_8_anexo_1">Relacion de Recibos</Link>
            </li>
            <li>
              {/* <Link href="" style={{ color: "red" }}>
                Relacion de Facturas
              </Link> */}
            </li>
            <li>
              {/* <Link href="" style={{ color: "red" }}>
                Estado de cuenta
              </Link> */}
            </li>
            <li>
              {/* <Link href="" style={{ color: "red" }}>
                Reporte Cobranza por Alumno
              </Link> */}
            </li>
            <li>
              {/* <Link href="" style={{ color: "red" }}>
                Reporte Cobranza por Producto
              </Link> */}
            </li>
            <li>
              {/* <Link href="" style={{ color: "red" }}>
                Recibo de pagos
              </Link> */}
            </li>
            <li>
              {/* <Link href="" style={{ color: "red" }}>
                Reporte Flujo Efectivo
              </Link> */}
            </li>
            <li>
              {/* <Link href="" style={{ color: "red" }}>
                Alumnos con Beca
              </Link> */}
            </li>
            <li>
              {/* <Link href="" style={{ color: "red" }}>
                Alumnos Inscritos
              </Link> */}
            </li>
          </ul>
        </details>
      </li>

      <li>
        <details>
          <summary>Pagos</summary>
          <ul>
            <li>
              <Link href="/pagos1">Pagos</Link>
            </li>
          </ul>
        </details>
      </li>
    </ul>
  );
}

export default Menu;
