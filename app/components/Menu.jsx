import React from "react";
import Link from "next/link";
function Menu({ vertical }) {
  return vertical ? (
    <ul
      tabIndex={0}
      className="menu menu-md dropdown-content bg-base-100 rounded-box  mt-3 w-52 p-2 shadow z-50"
    >
      <li>
        <details>
          <summary>Catalogos</summary>
          <ul>
            <li>
              <Link href="/productos">Productos</Link>
            </li>
            <li>
              <Link href="/formapago">Forma de Pago</Link>
            </li>
            <li>
              <Link href="/cajeros">Cajeros</Link>
            </li>
            <li>
            <Link href="/comentarios">Comentarios</Link>
            </li>
          </ul>
        </details>
        
      </li>
      <li>
      <details>
          <summary>Reportes</summary>
          <ul>
          <li>
            <Link href="/AlumnosPorClase">Lista de Alumnos por clase</Link>
            </li>
          </ul>
        </details>
      </li>
      <li>
        <a>Item 3</a>
      </li>
    </ul>
  ) : (
    <ul className="menu menu-horizontal px-1 z-[2] ">
      <li>
        <details>
          <summary>Catalogos</summary>
          <ul className="p-5 mt-3 w-52 ">
            <li>
              <Link href="/productos">Productos</Link>
            </li>
            <li>
              <Link href="/formapago">Forma de Pago</Link>
            </li>
            <li>
              <Link href="/cajeros">Cajeros</Link>
            </li>
            <li>
            <Link href="/comentarios">Comentarios</Link>
            </li>
          </ul>
        </details>
        </li>
        <li>
        <details>
          <summary>Reportes</summary>
          <ul>
          <li>
            <Link href="/AlumnosPorClase">Lista de Alumnos por clase</Link>
            </li>
          </ul>
        </details>
      </li>
      <li>
        <a>Item 3</a>
      </li>
    </ul>
  );

}

export default Menu;
