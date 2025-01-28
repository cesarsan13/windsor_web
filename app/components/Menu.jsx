"use client";
import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Para redirección
import { useSession } from "next-auth/react";
import { getMenus } from "@/app/utils/api/accesos_menu/accesos_menu";

function Menu({ vertical, toogle }) {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState({});
  const [menus, setMenus] = useState([]);
  const menuRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  //
  useEffect(() => {
    if (status === "loading" || !session) return;
    const fetchMenus = async () => {
      const { token } = session.user;
      const fetchedMenus = await getMenus(token, false);
      setMenus(fetchedMenus);

      const initialOpenState = fetchedMenus.reduce((acc, menu) => {
        acc[menu.menu] = false;
        return acc;
      }, {});
      setIsOpen(initialOpenState);
    };

    fetchMenus();
  }, [session, status]);

  const toggleMenu = (menu) => {
    setIsOpen((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        newState[key] = false;
      });
      newState[menu] = !prev[menu];
      return newState;
    });
  };

  const closeMenus = () => {
    setIsOpen(
      Object.keys(isOpen).reduce((acc, category) => {
        acc[category] = false;
        return acc;
      }, {})
    );
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      closeMenus();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const groupedMenus = menus.reduce((acc, menu) => {
    const { user } = session || {};
    if (!acc[menu.menu]) acc[menu.menu] = [];

    if (!user.es_admin && menu.menu === "Utilerías") {
      if (menu.descripcion === "Usuarios") {
        acc[menu.menu].push(menu);
      }
    } else {
      acc[menu.menu].push(menu);
    }
    return acc;
  }, {});

  const sortedCategories = Object.keys(groupedMenus).sort();

  const renderMenuItems = (category) => {
    const { permissions } = session.user;
    const { user } = session;
    return (groupedMenus[category] || []).map((menuItem) => {
      const is_admin = user.es_admin;
      const hasPermission =
        is_admin ||
        permissions.some(
          (perm) => perm.id_punto_menu === menuItem.numero && perm.t_a
        );
      const linkTo = hasPermission
        ? menuItem.ruta
        : `/acceso_denegado?menu=true`;
      return (
        <li key={menuItem.numero}>
          <Link
            href={linkTo}
            onClick={() => {
              closeMenus();
              if (isMobile) {
                toogle();
              }
              localStorage.setItem("puntoMenu", menuItem.numero);
            }}
          >
            {menuItem.descripcion}
          </Link>
        </li>
      );
    });
  };

  return vertical ? (
    <ul
      ref={menuRef}
      className="menu menu-md dropdown-content bg-base-100 rounded-box text-black dark:text-white mt-3 w-52 p-2 shadow z-50"
    >
      {sortedCategories.map((category) => (
        <li key={category}>
          <details open={isOpen[category]} onClick={() => toggleMenu(category)}>
            <summary>{category}</summary>
            <ul>{renderMenuItems(category)}</ul>
          </details>
        </li>
      ))}
    </ul>
  ) : (
    <div className="menu menu-horizontal px-1 z-[2] text-black dark:text-white w-[500px]">
      {sortedCategories.map((category) => (
        <div key={category} className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn m-1 bg-base-200 dark:bg-slate-700 border-none text-black dark:text-white shadow-none"
            onClick={() => toggleMenu(category)}
          >
            {category}
          </div>
          <ul
            className={`dropdown-content menu bg-base-100 rounded-box z-[1] p-2 mt-3 w-52 shadow ${
              isOpen[category] ? "" : "hidden"
            }`}
          >
            {renderMenuItems(category)}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default Menu;
