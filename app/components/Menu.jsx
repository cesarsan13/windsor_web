"use client";
import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";

function Menu({ vertical }) {
  const [isOpen, setIsOpen] = useState({
    archivos: false,
    reportes: false,
    pagos: false,
  });
  const menuRef = useRef(null);

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen({ archivos: false, reportes: false, pagos: false });
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggle = (menu) => {
    setIsOpen((prevState) => {
      const newState = { archivos: false, reportes: false, pagos: false };
      newState[menu] = !prevState[menu];
      return newState;
    });
  };

  return vertical ? (
    <ul
      ref={menuRef}
      tabIndex={0}
      className="menu menu-md dropdown-content bg-base-100 rounded-box text-black dark:text-white mt-3 w-52 p-2 shadow z-50"
    >
      <li>
        <details
          open={isOpen.archivos}
          onClick={() => handleToggle("archivos")}
        >
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
              <Link href="/horarios">Horarios</Link>
            </li>
            <li>
              <Link href="/formapago">Forma de Pago</Link>
            </li>
            <li>
              <Link href="/formfact">Formato Variable</Link>
            </li>
          </ul>
        </details>
      </li>
      <li>
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
      </li>
      <li className="hidden">
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
      </li>
      <li>
        <details
          open={isOpen.reportes}
          onClick={() => handleToggle("reportes")}
        >
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
                Lista de alumnos por clase semanal
              </Link>
            </li>
            <li>
              <Link href="/rep_femac_5">Altas y Bajas de Alumnos</Link>
            </li>
            <li>
              <Link href="/rep_femac_8_anexo_1">Relacion de Recibos</Link>
            </li>
          </ul>
        </details>
      </li>
      <li>
        <details open={isOpen.pagos} onClick={() => handleToggle("pagos")}>
          <summary>Pagos</summary>
          <ul className="p-1 mt-3 w-60">
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
              <Link href="/rep_femac_11_Anexo_3">
                Reporte Cobranza por Alumno
              </Link>
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
              <Link href="" style={{ color: "red" }}>
                Alumnos Inscritos
              </Link>
            </li>
          </ul>
        </details>
      </li>
      <li className="hidden">
        <details>
          <summary>Seguridad</summary>
          <ul>
            <li>
              <Link href="" style={{ color: "red" }}>
                Usuarios
              </Link>
            </li>
            <li>
              <Link href="" style={{ color: "red" }}>
                Acceso a Usuarios
              </Link>
            </li>
            <li>
              <Link href="" style={{ color: "red" }}>
                Utilerias
              </Link>
            </li>
          </ul>
        </details>
      </li>
      <li className="hidden">
        <details>
          <summary>Propietario</summary>
          <ul>
            <li>
              <Link href="" style={{ color: "red" }}>
                Propietario
              </Link>
            </li>
          </ul>
        </details>
      </li>
      <li className="hidden">
        <details>
          <summary>Video Ayuda</summary>
          <ul>
            <li>
              <Link href="" style={{ color: "red" }}>
                Carga de Cartera
              </Link>
            </li>
          </ul>
        </details>
      </li>
    </ul>
  ) : (
    <ul
      ref={menuRef}
      className="menu menu-horizontal px-1 z-[2] text-black dark:text-white"
    >
      <li>
        <details
          open={isOpen.archivos}
          onClick={() => handleToggle("archivos")}
        >
          <summary>Archivos</summary>
          <ul className="p-5 mt-3 w-52">
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
              <Link href="/horarios">Horarios</Link>
            </li>
            <li>
              <Link href="/formapago">Forma de Pago</Link>
            </li>
            <li>
              <Link href="/formfact">Formato Variable</Link>
            </li>
          </ul>
        </details>
      </li>
      <li>
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
      </li>

      <li>
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
      </li>
      <li>
        <details
          open={isOpen.reportes}
          onClick={() => handleToggle("reportes")}
        >
          <summary>Reportes</summary>
          <ul className="p-1 mt-3 w-60">
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
                Lista de alumnos por clase semanal
              </Link>
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
              <Link href="/rep_femac_11_Anexo_3">
                Reporte Cobranza por Alumno
              </Link>
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
      <li className="hidden">
        <details>
          <summary>Pagos</summary>
          <ul>
            <li>
              <Link href="" style={{ color: "red" }}>
                Usuarios
              </Link>
            </li>
            <li>
              <Link href="" style={{ color: "red" }}>
                Acceso a Usuarios
              </Link>
            </li>
            <li>
              <Link href="" style={{ color: "red" }}>
                Utilerias
              </Link>
            </li>
          </ul>
        </details>
      </li>
      <li className="hidden">
        <details>
          <summary>Propietario</summary>
          <ul>
            <li>
              <Link href="" style={{ color: "red" }}>
                Propietario
              </Link>
            </li>
          </ul>
        </details>
      </li>
      <li className="hidden">
        <details>
          <summary>Video Ayuda</summary>
          <ul>
            <li>
              <Link href="" style={{ color: "red" }}>
                Carga de Cartera
              </Link>
            </li>
          </ul>
        </details>
      </li>
    </ul>
  );
}

export default Menu;
